import { Ingredient } from '../../types/index';

export interface FoodDatabaseItem {
  id: string;
  name: string;
  aliases: string[];
  category: Ingredient['category'];
  defaultUnit: 'g' | 'ml' | 'ud' | 'cucharada';
  defaultAmount: number;
  icon?: string;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  perUnit?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  perTablespoon?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  thyroidFriendly: boolean;
  thyroidNote?: string;
}
