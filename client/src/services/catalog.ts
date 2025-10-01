// Catalog service for fetching data directly from queue database

export interface CatalogCategory {
  id: number;
  name: string;
  icon: string;
  displayOrder: number;
  updatedAt?: string;
  deletedAt?: string;
  contentHash?: string;
}

export interface CatalogMenuItem {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number; // in pennies
  mealPrice?: number; // in pennies
  available: boolean;
  image?: string;
  hasFlavorOptions: boolean;
  hasMealOption: boolean;
  isSpicyOption: boolean;
  hasToppingsOption: boolean;
  hasSaucesOption: boolean;
  updatedAt?: string;
  deletedAt?: string;
  contentHash?: string;
}

export interface CatalogData {
  categories: CatalogCategory[];
  items: CatalogMenuItem[];
}

// Format price from pennies to display string
export function formatPrice(priceInPennies: number): string {
  return `£${(priceInPennies / 100).toFixed(2)}`;
}

// Get catalog data directly from queue database
export async function getCatalogData(): Promise<CatalogData> {
  try {
    const response = await fetch('/api/catalog');
    if (!response.ok) {
      throw new Error('Failed to fetch catalog');
    }

    const data = await response.json();

    // Return the rich catalog data directly from queue database
    return {
      categories: data.categories || [],
      items: data.categories?.flatMap((cat: any) => cat.items || []) || []
    };
  } catch (error) {
    console.error('Failed to fetch catalog:', error);

    // Return empty catalog if error
    return {
      categories: [],
      items: []
    };
  }
}

// Group items by category with proper sorting
export function groupItemsByCategory(categories: CatalogCategory[], items: CatalogMenuItem[]) {
  // Filter out deleted categories and sort by display order
  const activeCategories = categories
    .filter(cat => !cat.deletedAt)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Filter out deleted and unavailable items
  const activeItems = items.filter(item => !item.deletedAt && item.available);

  // Group items by category
  return activeCategories.map(category => ({
    ...category,
    items: activeItems
      .filter(item => item.categoryId === category.id)
      .sort((a, b) => a.name.localeCompare(b.name))
  }));
}

// Flavor options for items that support them (from queue schema)
export const flavorOptions = [
  'Garlic & Hector',
  'Medium',
  'Hot',
  'Extra Hot',
  'BBQ'
];

// Toppings options for items that support them
export const toppingsOptions = [
  'Cheese',
  'Lettuce',
  'Mayo',
  'Burger Sauce',
  'Tomato',
  'Onions'
];

// Helper function to get image URL (consistent across components)
export function getImageUrl(imagePath?: string): string | null {
  if (!imagePath) return null;
  // If it's already a full URL, use it as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, proxy through our API
  return `/api/images/${imagePath}`;
}

// Enhanced menu item interface for UI
export interface EnhancedMenuItem extends CatalogMenuItem {
  displayPrice: string;
  displayMealPrice?: string;
  flavors?: string[];
  category?: CatalogCategory;
}