export type Category =
  "Hambúrgueres" | "Combos" | "Acompanhamentos" | "Bebidas" | "Sobremesas";
export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  bestseller?: boolean;
  available?: boolean;
  category: Category;
  image: string;
  tag?: string;
  ingredients: string[];
}
export type Doneness = "mal-passado" | "ao-ponto" | "bem-passado";
export interface Extra {
  id: string;
  name: string;
  priceCents: number;
  available: boolean;
  vegetarian: boolean;
}
export interface OptionChoice {
  id: string;
  name: string;
  priceCents: number;
  available: boolean;
}
export interface OptionGroup {
  id: string;
  name: string;
  quantity: number;
  choices: OptionChoice[];
}
export interface ProductOptions {
  extraIds: string[];
  removableIngredients: string[];
  doneness: boolean;
  comboGroups?: OptionGroup[];
}
export interface ProductConfiguration {
  removedIngredients: string[];
  extraIds: string[];
  doneness: Doneness | null;
  notes: string;
  combo: Record<string, string>;
}
export interface CartItem {
  key: string;
  productId: string;
  quantity: number;
  configuration: ProductConfiguration;
}
export interface CheckoutData {
  name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
  payment: "pix" | "credit" | "debit" | "cash";
}
