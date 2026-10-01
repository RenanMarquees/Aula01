import { refreshMenu } from "./menu-store";
import { RepoError } from "./repo/types";
import { showError, showToast } from "./toast";

/**
 * Executa uma alteração no fichário, avisa o resultado e atualiza o cardápio na tela.
 * Devolve true se deu certo.
 */
export async function runAction(action: () => Promise<void>, success?: string): Promise<boolean> {
  try {
    await action();
    await refreshMenu();
    if (success) showToast(success);
    return true;
  } catch (error) {
    showError(error instanceof RepoError ? error.message : "Algo deu errado. Tente de novo.");
    // Mesmo com erro, recarrega: a tela volta a refletir o que está realmente salvo.
    await refreshMenu();
    return false;
  }
}

/**
 * Move um elemento uma posição para cima (-1) ou para baixo (+1) na lista ordenada
 * e devolve só os elementos cuja posição mudou (para salvar).
 */
export function moveInList<T extends { id: string; position: number }>(
  sorted: T[],
  id: string,
  direction: -1 | 1,
): T[] {
  const index = sorted.findIndex((entry) => entry.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sorted.length) return [];

  const reordered = [...sorted];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  // Renumera tudo em sequência; evita problemas com posições repetidas.
  return reordered
    .map((entry, position) => ({ ...entry, position }))
    .filter((entry, position) => sorted.find((old) => old.id === entry.id)?.position !== position);
}

/**
 * Deixa só os números e garante o código do Brasil (55) na frente.
 * "(43) 99928-8173" → "5543999288173".
 */
export function normalizeWhatsapp(text: string): string {
  const digits = text.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function isValidWhatsapp(text: string): boolean {
  const digits = normalizeWhatsapp(text);
  return digits.length >= 12 && digits.length <= 15;
}

/** "5543999288173" → "+55 (43) 99928-8173". */
export function formatWhatsapp(digits: string): string {
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `+55 (${match[1]}) ${match[2]}-${match[3]}` : digits ? `+${digits}` : "";
}

/**
 * Reduz a foto antes de enviar (lado maior até `maxSize` px, JPEG).
 * Fotos de celular têm vários MB; reduzidas, o cardápio abre bem mais rápido.
 */
export async function shrinkImage(file: File, maxSize: number, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível preparar a foto.");
  // Fundo branco: evita fundo preto em imagens com transparência (PNG).
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível preparar a foto."))),
      "image/jpeg",
      quality,
    );
  });
}
