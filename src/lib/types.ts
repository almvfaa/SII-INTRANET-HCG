export interface Profile {
  id: string;
  name: string;
  type: 'service' | 'pathology';
  rules: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nutritionalInfo: string;
  supplier: string;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  linkedItemCodes: string[];
  imageUrl?: string;
}

export interface ScheduledMenu {
  date: string; // YYYY-MM-DD
  serviceProfileId: string;
  pathologyProfileId: string;
  menu: string;
}

export interface CatalogItem {
  code: string;
  description: string;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: {
    item: CatalogItem;
    quantity: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  recipes: Recipe[];
}
