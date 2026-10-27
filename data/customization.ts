import type { Extra, OptionGroup, ProductOptions } from "@/types";
export const extras: Extra[] = [
  {
    id: "bacon",
    name: "Bacon extra",
    priceCents: 500,
    available: true,
    vegetarian: false,
  },
  {
    id: "cheddar",
    name: "Cheddar extra",
    priceCents: 400,
    available: true,
    vegetarian: true,
  },
  {
    id: "patty",
    name: "Hambúrguer extra",
    priceCents: 1200,
    available: true,
    vegetarian: false,
  },
  {
    id: "sauce",
    name: "Molho especial",
    priceCents: 300,
    available: true,
    vegetarian: true,
  },
  {
    id: "onion",
    name: "Cebola crispy",
    priceCents: 300,
    available: false,
    vegetarian: true,
  },
];
const comboGroups = (quantity: number): OptionGroup[] => [
  {
    id: "burger",
    name: quantity === 1 ? "Hambúrguer" : "Hambúrgueres (2 iguais)",
    quantity,
    choices: [
      { id: "cidade", name: "Cidade Original", priceCents: 0, available: true },
      {
        id: "bacon",
        name: "Bacon Boulevard",
        priceCents: 500,
        available: true,
      },
      {
        id: "duplo",
        name: "Duplo da Cidade",
        priceCents: 1000,
        available: true,
      },
      { id: "veggie", name: "Jardim Veggie", priceCents: 300, available: true },
    ],
  },
  {
    id: "fries",
    name: quantity === 1 ? "Batata" : "Batata para compartilhar",
    quantity,
    choices: [
      {
        id: "classic",
        name: "Fritas tradicionais",
        priceCents: 0,
        available: true,
      },
      {
        id: "loaded",
        name: "Fritas cheddar e bacon",
        priceCents: 800,
        available: true,
      },
      {
        id: "rustic",
        name: "Fritas rústicas · indisponível",
        priceCents: 500,
        available: false,
      },
    ],
  },
  {
    id: "drink",
    name: quantity === 1 ? "Bebida" : "Bebidas (2 iguais)",
    quantity,
    choices: [
      {
        id: "cola",
        name: "Refrigerante 350ml",
        priceCents: 0,
        available: true,
      },
      {
        id: "lemonade",
        name: "Limonada da Casa",
        priceCents: 500,
        available: true,
      },
    ],
  },
];
const allExtras = extras.map((e) => e.id);
export const productOptions: Record<string, ProductOptions> = {
  cidade: {
    extraIds: allExtras,
    removableIngredients: ["Cheddar", "Alface", "Tomate", "Molho da casa"],
    doneness: true,
  },
  bacon: {
    extraIds: allExtras,
    removableIngredients: [
      "Bacon",
      "Cheddar",
      "Cebola caramelizada",
      "Maionese artesanal",
    ],
    doneness: true,
  },
  duplo: {
    extraIds: allExtras,
    removableIngredients: ["Cheddar duplo", "Picles", "Molho especial"],
    doneness: true,
  },
  veggie: {
    extraIds: ["cheddar", "sauce", "onion"],
    removableIngredients: ["Alface", "Tomate", "Molho de ervas"],
    doneness: false,
  },
  combo: {
    extraIds: allExtras,
    removableIngredients: [],
    doneness: false,
    comboGroups: comboGroups(1),
  },
  dupla: {
    extraIds: allExtras,
    removableIngredients: [],
    doneness: false,
    comboGroups: comboGroups(2),
  },
};
export const donenessLabels = {
  "mal-passado": "Mal passado",
  "ao-ponto": "Ao ponto",
  "bem-passado": "Bem passado",
};
export const checkoutSettings = {
  deliveryFeeCents: 600,
  deliveryLabel: "Frete fictício configurado para demonstração",
  timeframe: "Prazo indisponível · sem consulta de entrega",
};
export const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
