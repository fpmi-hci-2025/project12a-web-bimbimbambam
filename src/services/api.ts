import {
  JwtRequest,
  JwtResponse,
  SaveUserDTO,
  UserDTO,
  ProductDTO,
  ProductDetailsDTO,
  CategoryDTO,
  BrandDTO,
  CartDTO,
  OrderDTO,
  ReviewDTO,
  ReviewResponseDTO,
  PageResponse,
  PageableRequest,
  ProductFilters,
  ApiError,
} from '../types/api';

const BASE_URL = 'https://project12a-backend-bimbimbambam-efjv.onrender.com/api/v1';


let authToken: string | null = localStorage.getItem('auth_token');
let tokenRefreshTimeout: NodeJS.Timeout | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
    // Refresh token every 25 minutes (tokens expire in 30 minutes)
    if (tokenRefreshTimeout) clearTimeout(tokenRefreshTimeout);
    tokenRefreshTimeout = setTimeout(() => {
      setAuthToken(null);
      window.location.href = '/';
    }, 25 * 60 * 1000);
  } else {
    localStorage.removeItem('auth_token');
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout);
      tokenRefreshTimeout = null;
    }
  }
};

export const getAuthToken = () => authToken;


async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };


  if (authToken && !endpoint.includes('/auth/')) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });


    if (response.status === 401) {
      // 401 во время логина — это НЕ истёкшая сессия
      if (endpoint.includes('/auth')) {
        const errorData: ApiError = await response.json();
        throw new Error('Неверный логин или пароль');
      }

      // 401 для защищённых эндпоинтов → сессия истекла
      setAuthToken(null);
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }


    if (!response.ok) {
      let errorMessage = 'Произошла ошибка';
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {

      }
      throw new Error(errorMessage);
    }


    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Ошибка сети. Проверьте подключение к интернету.');
  }
}


export const authAPI = {
  signIn: async (credentials: JwtRequest): Promise<JwtResponse> => {
    return apiCall<JwtResponse>('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signUp: async (userData: SaveUserDTO): Promise<UserDTO> => {
    return apiCall<UserDTO>('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};


export const userAPI = {
  getProfile: async (): Promise<UserDTO> => {
    return apiCall<UserDTO>('/users/profile');
  },

  getUserById: async (id: number): Promise<UserDTO> => {
    return apiCall<UserDTO>(`/users/${id}`);
  },

  updateUser: async (id: number, userData: SaveUserDTO): Promise<UserDTO> => {
    return apiCall<UserDTO>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiCall<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getAllUsers: async (pageable: PageableRequest): Promise<PageResponse<UserDTO>> => {
    const params = new URLSearchParams();
    if (pageable.page !== undefined) params.append('page', pageable.page.toString());
    if (pageable.size !== undefined) params.append('size', pageable.size.toString());
    if (pageable.sort) pageable.sort.forEach(s => params.append('sort', s));
    
    return apiCall<PageResponse<UserDTO>>(`/users?${params.toString()}`);
  },
};


export const catalogAPI = {
  getProducts: async (
    filters: ProductFilters = {},
    pageable: PageableRequest = {}
  ): Promise<PageResponse<ProductDTO>> => {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('query', filters.query);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.brandId) filters.brandId.forEach(id => params.append('brandId', id.toString()));
    if (filters.categoryId !== undefined) params.append('categoryId', filters.categoryId.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    
    if (pageable.page !== undefined) params.append('page', pageable.page.toString());
    if (pageable.size !== undefined) params.append('size', pageable.size.toString());
    if (pageable.sort) pageable.sort.forEach(s => params.append('sort', s));

    return apiCall<PageResponse<ProductDTO>>(`/products?${params.toString()}`);
  },

  getProductById: async (id: number): Promise<ProductDetailsDTO> => {
    return apiCall<ProductDetailsDTO>(`/products/${id}`);
  },

  getCategories: async (): Promise<CategoryDTO[]> => {
    return apiCall<CategoryDTO[]>('/categories');
  },

  getBrands: async (): Promise<BrandDTO[]> => {
    return apiCall<BrandDTO[]>('/brands');
  },
};


export const cartAPI = {
  getCart: async (): Promise<CartDTO> => {
    return apiCall<CartDTO>('/cart');
  },

  addToCart: async (productId: number, quantity: number = 1): Promise<CartDTO> => {
    return apiCall<CartDTO>(`/cart/add?productId=${productId}&quantity=${quantity}`, {
      method: 'POST',
    });
  },

  updateQuantity: async (productId: number, quantity: number): Promise<CartDTO> => {
    return apiCall<CartDTO>(`/cart/update?productId=${productId}&quantity=${quantity}`, {
      method: 'PATCH',
    });
  },

  removeFromCart: async (productId: number): Promise<CartDTO> => {
    return apiCall<CartDTO>(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (): Promise<void> => {
    return apiCall<void>('/cart/clear', {
      method: 'DELETE',
    });
  },
};


export const favoritesAPI = {
  getFavorites: async (pageable: PageableRequest = {}): Promise<PageResponse<ProductDTO>> => {
    const params = new URLSearchParams();
    if (pageable.page !== undefined) params.append('page', pageable.page.toString());
    if (pageable.size !== undefined) params.append('size', pageable.size.toString());
    if (pageable.sort) pageable.sort.forEach(s => params.append('sort', s));

    return apiCall<PageResponse<ProductDTO>>(`/favorites?${params.toString()}`);
  },

  toggleFavorite: async (productId: number): Promise<void> => {
    return apiCall<void>(`/favorites/${productId}`, {
      method: 'POST',
    });
  },
};

export const comparisonAPI = {
  getComparison: async (): Promise<ProductDetailsDTO[]> => {
    return apiCall<ProductDetailsDTO[]>('/comparison');
  },

  toggleProduct: async (productId: number): Promise<ProductDetailsDTO[]> => {
    return apiCall<ProductDetailsDTO[]>(`/comparison/${productId}`, {
      method: 'POST',
    });
  },

  clearComparison: async (): Promise<void> => {
    return apiCall<void>('/comparison/clear', {
      method: 'DELETE',
    });
  },
};


export const ordersAPI = {
  createOrder: async (deliveryAddress: string, contactPhone?: string): Promise<OrderDTO> => {
    const params = new URLSearchParams({ deliveryAddress });
    if (contactPhone) params.append('contactPhone', contactPhone);

    return apiCall<OrderDTO>(`/orders?${params.toString()}`, {
      method: 'POST',
    });
  },

  getUserOrders: async (): Promise<OrderDTO[]> => {
    return apiCall<OrderDTO[]>('/orders');
  },

  getOrderById: async (id: number): Promise<OrderDTO> => {
    return apiCall<OrderDTO>(`/orders/${id}`);
  },

  payOrder: async (id: number): Promise<OrderDTO> => {
    return apiCall<OrderDTO>(`/orders/${id}/pay`, {
      method: 'POST',
    });
  },
};


export const reviewsAPI = {
  addReview: async (review: ReviewDTO): Promise<ReviewResponseDTO> => {
    return apiCall<ReviewResponseDTO>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  getProductReviews: async (
    productId: number,
    pageable: PageableRequest = {}
  ): Promise<PageResponse<ReviewResponseDTO>> => {
    const params = new URLSearchParams();
    if (pageable.page !== undefined) params.append('page', pageable.page.toString());
    if (pageable.size !== undefined) params.append('size', pageable.size.toString());
    if (pageable.sort) pageable.sort.forEach(s => params.append('sort', s));

    return apiCall<PageResponse<ReviewResponseDTO>>(`/reviews/product/${productId}?${params.toString()}`);
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    return apiCall<void>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};
