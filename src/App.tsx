import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { CatalogPage } from './components/CatalogPage';
import { ProductDetail } from './components/ProductDetail';
import { ComparePage } from './components/ComparePage';
import { CartPage } from './components/CartPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AuthPage } from './components/AuthPage';
import { AccountPage } from './components/AccountPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { Toaster } from './components/ui/sonner';

import {
  catalogAPI,
  cartAPI,
  favoritesAPI,
  comparisonAPI,
} from './services/api';

import {
  ProductDTO,
  ProductDetailsDTO,
  CartDTO,
  CategoryDTO,
  BrandDTO,
} from './types/api';

import { toast } from 'sonner';


function ProductDetailRoute(props: any) {
  const { id } = useParams();
  return <ProductDetailLoader productId={Number(id)} {...props} />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1_000_000]);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [currentPageNum, setCurrentPageNum] = useState(0);


  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [cart, setCart] = useState<CartDTO>({
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  });
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [compareProducts, setCompareProducts] = useState<ProductDetailsDTO[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);


  useEffect(() => {
    catalogAPI.getCategories().then(setCategories);
    catalogAPI.getBrands().then(setBrands);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    cartAPI.getCart().then(setCart);
    favoritesAPI
      .getFavorites({ page: 0, size: 1000 })
      .then(r => setFavoriteIds(r.content.map(p => p.id)));
    comparisonAPI.getComparison().then(setCompareProducts);
  }, [isAuthenticated]);


  useEffect(() => {
    loadProducts();
  }, [
    searchQuery,
    selectedCategoryId,
    selectedBrandIds,
    priceRange,
    minRating,
    inStock,
    sortBy,
    currentPageNum,
  ]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await catalogAPI.getProducts(
        {
          query: searchQuery || undefined,
          categoryId: selectedCategoryId || undefined,
          brandId: selectedBrandIds.length ? selectedBrandIds : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating: minRating || undefined,
          inStock: inStock || undefined,
        },
        {
          page: currentPageNum,
          size: 20,
          sort: sortBy !== 'default' ? [sortBy] : undefined,
        }
      );
      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch {
      toast.error('Не удалось загрузить товары');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: location } });
      return;
    }
    action();
  };


  const handleProductClick = (id: number) =>
    navigate(`/product/${id}`);

  const handleToggleFavorite = (id: number) =>
    requireAuth(async () => {
      await favoritesAPI.toggleFavorite(id);
      setFavoriteIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    });

  const handleToggleCompare = (id: number) =>
    requireAuth(async () => {
      const updated = await comparisonAPI.toggleProduct(id);
      setCompareProducts(updated);
    });

  const handleAddToCart = (id: number, qty = 1) =>
    requireAuth(async () => {
      const updated = await cartAPI.addToCart(id, qty);
      setCart(updated);
    });

  const handleUpdateCartQuantity = async (id: number, qty: number) => {
    if (qty < 1) return;
    const updated = await cartAPI.updateQuantity(id, qty);
    setCart(updated);
  };

  const handleRemoveFromCart = async (id: number) => {
    const updated = await cartAPI.removeFromCart(id);
    setCart(updated);
  };

  if (authLoading) {
    return <div className="p-12 text-center">Загрузка...</div>;
  }

  const handleSearchSubmit = () => {
    setCurrentPageNum(0); // сбрасываем пагинацию
    loadProducts();
  };


  return (
    <div className="min-h-screen bg-gray-50 pt-safe">

    <div className="min-h-screen bg-gray-50">
<div className="safe-header sticky top-0 z-50 bg-white border-b">
  <Header
    cartItemsCount={cart.totalQuantity}
    favoritesCount={favoriteIds.length}
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    onNavigate={(path) => navigate(path)}
  />
</div>


      <Routes>
        {}
        <Route
          path="/"
          element={
            <CatalogPage
              products={products}
              categories={categories}
              brands={brands}
              favoriteIds={favoriteIds}
              compareIds={compareProducts.map(p => p.id)}
              selectedCategoryId={selectedCategoryId}
              selectedBrandIds={selectedBrandIds}
              priceRange={priceRange}
              minRating={minRating}
              inStock={inStock}
              sortBy={sortBy}
              onProductClick={handleProductClick}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onAddToCart={handleAddToCart}
              onCategoryChange={setSelectedCategoryId}
              onBrandChange={setSelectedBrandIds}
              onPriceRangeChange={setPriceRange}
              onRatingChange={setMinRating}
              onInStockChange={setInStock}
              onSortChange={setSortBy}
              onCompareClick={() => navigate('/compare')}
              isLoading={isLoadingProducts}
              currentPage={currentPageNum}
              totalPages={totalPages}
              onPageChange={setCurrentPageNum}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          }
        />

        {}
        <Route
          path="/product/:id"
          element={
            <ProductDetailRoute
              favoriteIds={favoriteIds}
              compareProducts={compareProducts}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onAddToCart={handleAddToCart}
            />
          }
        />

        {}
        <Route
          path="/compare"
          element={
            <ComparePage
              products={compareProducts}
              onRemove={handleToggleCompare}
              onProductClick={handleProductClick}
            />
          }
        />

        {}
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favoriteIds={favoriteIds}
              compareIds={compareProducts.map(p => p.id)}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onAddToCart={handleAddToCart}
            />
          }
        />

        {}
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemove={handleRemoveFromCart}
            />
          }
        />

        {}
        <Route
          path="/checkout"
          element={
            isAuthenticated ? (
              <CheckoutPage cart={cart} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {}
        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <AccountPage />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {}
        <Route
          path="/order/:id"
          element={
            isAuthenticated ? (
              <OrderDetailPage />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {}
        <Route path="/auth" element={<AuthPage />} />

        {}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="bottom-right" />
    </div>
</div>
  );
}



function ProductDetailLoader({
  productId,
  favoriteIds,
  compareProducts,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
}: any) {
  const [product, setProduct] = useState<ProductDetailsDTO | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    catalogAPI.getProductById(productId).then(setProduct);
  }, [productId]);

  if (!product) {
    return <div className="p-12 text-center">Загрузка...</div>;
  }

  return (
    <ProductDetail
      product={product}
      isFavorite={favoriteIds.includes(product.id)}
      isInCompare={compareProducts.some(p => p.id === product.id)}
      onToggleFavorite={onToggleFavorite}
      onToggleCompare={onToggleCompare}
      onAddToCart={onAddToCart}
      onBack={() => navigate(-1)}
    />
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
