import { ItemEditorPage } from "@/components/painel/ItemEditorPage";

export default async function EditItemPage({ params }: PageProps<"/painel/prato/[id]">) {
  const { id } = await params;
  return <ItemEditorPage id={id} />;
}
