// Catalog service for fetching synced catalog data

export interface CatalogCategory {
  id: number;
  queueId: number;
  name: string;
  icon: string;
  displayOrder: number;
  updatedAt?: string;
  deletedAt?: string;
  contentHash?: string;
}

export interface CatalogMenuItem {
  id: number;
  queueId: number;
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
  hasToppingsOptions?: boolean;
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

// Get catalog data (from API in production, fallback to old data in development)
export async function getCatalogData(): Promise<CatalogData> {
  try {
    // First try to get synced catalog data
    const response = await fetch('/api/catalog');
    if (!response.ok) {
      throw new Error('Failed to fetch catalog');
    }

    const data = await response.json();

    // If we have synced data, use it
    if (data.categories && data.categories.length > 0 && data.items && data.items.length > 0) {
      return data;
    }

    // Otherwise fall through to legacy menu API
    throw new Error('No synced catalog data available');
  } catch (error) {
    console.warn('Failed to fetch synced catalog, falling back to legacy menu API:', error);

    // Fallback to legacy menu API until sync is implemented
    try {
      const menuResponse = await fetch('/api/menu');
      if (!menuResponse.ok) {
        throw new Error('Failed to fetch menu');
      }

      const menuItems = await menuResponse.json();

      // Transform legacy menu items to catalog format
      // For now, put all items in a single "Menu" category
      const fallbackCategory = {
        id: 1,
        queueId: 0,
        name: "Menu",
        icon: "utensils",
        displayOrder: 0
      };

      return {
        categories: [fallbackCategory],
        items: menuItems.map((item: any) => {
          const priceInPennies =
            typeof item.price === 'number'
              ? item.price
              : Math.round(Number(item.price) * 100);

          return {
            ...item,
            price: priceInPennies,
            categoryId: 1, // Assign to fallback category
            queueId: 0,
            hasFlavorOptions: true, // Enable flavors for all items in fallback
            hasMealOption: false,
            isSpicyOption: false,
            hasToppingsOptions: true, // Enable toppings for all items in fallback
            available: true
          };
        })
      };
    } catch (menuError) {
      console.error('Failed to fetch legacy menu:', menuError);
      return {
        categories: [],
        items: []
      };
    }
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

// Flavor options for items that support them
export const flavorOptions = [
  'Lemon & Herb',
  'Garlic & Herb',
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