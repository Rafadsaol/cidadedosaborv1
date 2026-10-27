export type Category =
  "Hambúrgueres" | "Combos" | "Acompanhamentos" | "Bebidas" | "Sobremesas";
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  tag?: string;
  ingredients: string[];
}
export interface CartItem {
  productId: string;
  quantity: number;
}
