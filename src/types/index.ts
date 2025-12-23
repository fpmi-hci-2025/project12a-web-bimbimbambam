export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  characteristics: Record<string, string>;
  detailImages: string[];
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'popular';

export interface Filters {
  priceRange: [number, number];
  brands: string[];
  rating: number;
  inStock: boolean;
  [key: string]: any;
}
