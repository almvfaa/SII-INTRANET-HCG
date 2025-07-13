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
  id:string;
  name: string;
  description: string;
  itemIds: string[];
}

export interface ScheduledMenu {
  date: string; // YYYY-MM-DD
  serviceProfileId: string;
  pathologyProfileId: string;
  menu: string;
}
