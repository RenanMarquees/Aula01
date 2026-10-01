import {
  Beef,
  Beer,
  CakeSlice,
  Citrus,
  CupSoda,
  Dessert,
  Fish,
  GlassWater,
  Hamburger,
  IceCreamBowl,
  Cookie,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import Image from "next/image";
import type { IconName, MenuItem } from "@/lib/types";

const icons: Record<IconName, LucideIcon> = {
  utensils: Utensils,
  salad: Salad,
  sandwich: Sandwich,
  soup: Soup,
  beef: Beef,
  fish: Fish,
  hamburger: Hamburger,
  cookie: Cookie,
  citrus: Citrus,
  "cup-soda": CupSoda,
  "glass-water": GlassWater,
  beer: Beer,
  "cake-slice": CakeSlice,
  dessert: Dessert,
  "ice-cream-bowl": IceCreamBowl,
  wheat: Wheat,
};

/** Ícone decorativo de traço fino, escolhido pelo nome. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component strokeWidth={1.4} aria-hidden {...props} />;
}

/** "Foto" provisória: ícone sobre um fundo neutro, até o dono enviar a foto real. */
export function PhotoPlaceholder({
  name,
  className = "",
  size = 36,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-tile text-accent/70 ${className}`}
    >
      <Icon name={name} size={size} strokeWidth={1.2} />
    </div>
  );
}

/** Foto do prato; sem foto, mostra o ícone escolhido. */
export function ItemPhoto({
  item,
  className = "",
  iconSize = 36,
}: {
  item: Pick<MenuItem, "photoUrl" | "icon">;
  className?: string;
  iconSize?: number;
}) {
  if (!item.photoUrl) return <PhotoPlaceholder name={item.icon} size={iconSize} className={className} />;
  return (
    <div aria-hidden className={`relative overflow-hidden bg-tile ${className}`}>
      <Image src={item.photoUrl} alt="" fill sizes="(max-width: 448px) 100vw, 448px" unoptimized className="object-cover" />
    </div>
  );
}
