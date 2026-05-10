import { categories, products } from '../data/mockData';
import { Category } from '../models/ui_types/category';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    await delay(700);
    return [...categories];
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(1000);
    const newCategory: Category = {
      ...data,
      id: `CAT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    categories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    await delay(1000);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    // If name changes, we should ideally update product categoryNames too if they are stored as strings
    const oldName = categories[index].name;
    categories[index] = { ...categories[index], ...data };
    
    if (data.name && data.name !== oldName) {
      products.forEach(p => {
        if (p.categoryId === id) p.categoryName = data.name;
      });
    }
    
    return categories[index];
  },

  deleteCategory: async (id: string, replacementId: string): Promise<void> => {
    await delay(1200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const replacement = categories.find(c => c.id === replacementId);
    if (!replacement) throw new Error('Replacement category not found');

    // Update all products belonging to the deleted category
    products.forEach(p => {
      if (p.categoryId === id) {
        p.categoryId = replacementId;
        p.categoryName = replacement.name;
      }
    });

    // Remove the category
    categories.splice(index, 1);
  }
};
