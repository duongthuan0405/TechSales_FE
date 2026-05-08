import { categories } from '../data/mockData';
import { Category } from '../models/ui_types/category';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    await delay(700);
    return [...categories];
  }
};
