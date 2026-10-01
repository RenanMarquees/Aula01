import type { Metadata } from "next";
import { ItemDetail } from "@/components/ItemDetail";

export const metadata: Metadata = {
  title: "Prato · Cardápio digital",
};

export default async function ItemPage({ params }: PageProps<"/item/[id]">) {
  const { id } = await params;
  return <ItemDetail id={id} />;
}
