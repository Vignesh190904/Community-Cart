export const CATEGORIES = [
    "grocery",
    "pharmacy",
    "bakery",
    "fruits",
    "vegetables",
    "laundry",
    "electronics"
] as const;

export type Category = typeof CATEGORIES[number];
