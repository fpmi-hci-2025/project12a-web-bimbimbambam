import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { ProductDTO } from '../types/api';
import { ProductCard } from './ProductCard';
import { favoritesAPI } from '../services/api';
import { toast } from 'sonner';

interface FavoritesPageProps {
  favoriteIds: number[];
  compareIds: number[];
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onAddToCart: (id: number) => void;
}

export function FavoritesPage({
  favoriteIds,
  compareIds,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
}: FavoritesPageProps) {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------------------------------------
     LOAD FAVORITES
  --------------------------------------------- */
  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoritesAPI.getFavorites({
        page: 0,
        size: 1000,
      });
      setProducts(response.content);
    } catch {
      toast.error('Не удалось загрузить избранное');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------
     LOADING STATE
  --------------------------------------------- */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  /* ---------------------------------------------
     EMPTY STATE
  --------------------------------------------- */
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>

        <div className="text-center py-12">
          <Heart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="mb-4 text-xl font-semibold">
            Избранное пусто
          </h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары в избранное
          </p>
          <Button onClick={() => navigate('/')}>
            Перейти к каталогу
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </Button>

      <h1 className="mb-6 text-2xl font-semibold">
        Избранное ({products.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            isInCompare={compareIds.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onToggleCompare={onToggleCompare}
            onAddToCart={onAddToCart}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
