import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/ItemDetail";
import { findItem, items } from "@/lib/menu-data";

export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps<"/item/[id]">) {
  const { id } = await params;
  const item = findItem(id);
  return { title: item ? `${item.name} · Cardápio digital` : "Cardápio digital" };
}

export default async function ItemPage({ params }: PageProps<"/item/[id]">) {
  const { id } = await params;
  const item = findItem(id);
  if (!item || !item.available) notFound();

  return <ItemDetail item={item} />;
}
