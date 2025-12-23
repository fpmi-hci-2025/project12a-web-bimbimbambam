// API Types based on OpenAPI schema

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles: string[];
}

export interface SaveUserDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface JwtRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export interface ProductDTO {
  id: number;
  title: string;
  price: number;
  averageRating: number;
  imageUrl: string;
  brandName: string;
  categoryName: string;
  quantity: number;
}

export interface ProductAttributeDTO {
  name: string;
  value: string;
}

export interface ProductDetailsDTO {
  id: number;
  title: string;
  price: number;
  averageRating: number;
  imageUrl: string;
  brandName: string;
  categoryName: string;
  quantity: number;
  description: string;
  images: string[];
  attributes: ProductAttributeDTO[];
}

export interface CategoryDTO {
  id: number;
  name: string;
  parentId?: number;
}

export interface BrandDTO {
  id: number;
  name: string;
}

export interface CartItem {
  productId: number;
  productTitle: string;
  quantity: number;
  pricePerUnit: number;
  imageUrl: string;
}

export interface CartDTO {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

export interface OrderItemDTO {
  productId: number;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
}

export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderDTO {
  id: number;
  userId: number;
  status: OrderStatus;
  totalPrice: number;
  deliveryAddress: string;
  contactPhone: string;
  createdAt: string;
  items: OrderItemDTO[];
}

export interface ReviewDTO {
  productId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponseDTO {
  id: number;
  userId: number;
  username: string;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PageableRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  empty: boolean;
}

export interface ProductFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  brandId?: number[];
  categoryId?: number;
  inStock?: boolean;
  minRating?: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
