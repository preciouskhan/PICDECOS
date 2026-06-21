import eggs from "@/assets/product-eggs.jpg";
import honey from "@/assets/product-honey.jpg";
import maize from "@/assets/product-maize.jpg";
import chicks from "@/assets/product-chicks.jpg";
import potatoes from "@/assets/product-potatoes.jpg";

// Category/name → fallback image when admin hasn't uploaded one yet
export function productImageFor(category: string, name: string): string {
  const k = `${category} ${name}`.toLowerCase();
  if (k.includes("egg")) return eggs;
  if (k.includes("honey") || k.includes("apiary") || k.includes("bee")) return honey;
  if (k.includes("maize") || k.includes("corn") || k.includes("soya") || k.includes("flour") || k.includes("feed")) return maize;
  if (k.includes("chick") || k.includes("poultry") || k.includes("broiler") || k.includes("layer")) return chicks;
  if (k.includes("potato") || k.includes("vegetable") || k.includes("crop")) return potatoes;
  // sensible defaults by category
  const c = category.toLowerCase();
  if (c.includes("poultry")) return chicks;
  if (c.includes("crop") || c.includes("processing")) return maize;
  if (c.includes("apiary")) return honey;
  return potatoes;
}
