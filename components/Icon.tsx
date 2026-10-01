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
import type { IconName } from "@/lib/menu-data";

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
