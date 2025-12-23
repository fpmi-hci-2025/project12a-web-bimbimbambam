import { useState, useEffect } from 'react';
import { Heart, Star, GitCompare, ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ProductDetailsDTO, ReviewResponseDTO } from '../types/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { reviewsAPI } from '../services/api';

interface ProductDetailProps {
  product: ProductDetailsDTO;
  isFavorite: boolean;
  isInCompare: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onAddToCart: (id: number) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ProductDetail({
  product,
  isFavorite,
  isInCompare,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
  onBack,
  isLoading = false,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewsAPI.getProductReviews(product.id, {
        page: 0,
        size: 10,
        sort: ['createdAt,desc'],
      });
      setReviews(response.content);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const isOutOfStock = product.quantity === 0;
  const displayImages = product.images.length > 0 ? product.images : [product.imageUrl];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 gap-2"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
        Назад к каталогу
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {isOutOfStock && (
              <Badge className="absolute top-4 left-4 z-10 bg-red-500">
                Нет в наличии
              </Badge>
            )}
            <ImageWithFallback
              src={displayImages[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">{product.brandName}</p>
            <h1 className="mt-1 mb-2">{product.title}</h1>
            <p className="text-sm text-gray-600 mb-2">{product.categoryName}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({reviews.length} отзывов)</span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-3xl text-primary">{product.price.toFixed(2)} BYN</p>
            {isOutOfStock ? (
              <p className="text-sm text-red-600 mt-1">Нет в наличии</p>
            ) : product.quantity < 10 ? (
              <p className="text-sm text-orange-600 mt-1">
                Осталось всего {product.quantity} шт.
              </p>
            ) : (
              <p className="text-sm text-green-600 mt-1">В наличии</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => onAddToCart(product.id)}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
            </Button>
            <Button
              size="lg"
              variant={isFavorite ? 'default' : 'outline'}
              onClick={() => onToggleFavorite(product.id)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="lg"
              variant={isInCompare ? 'default' : 'outline'}
              onClick={() => onToggleCompare(product.id)}
            >
              <GitCompare className="h-5 w-5" />
            </Button>
          </div>

          {product.description && (
            <p className="text-gray-700">{product.description}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="characteristics" className="mt-12">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="characteristics">Характеристики</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="characteristics" className="mt-6">
          <div className="bg-white border rounded-lg overflow-hidden">
            {product.attributes.length > 0 ? (
              <table className="w-full">
                <tbody>
                  {product.attributes.map((attr, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 text-gray-600 w-1/3">{attr.name}</td>
                      <td className="px-6 py-4">{attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-600">
                Характеристики не указаны
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6 space-y-6">
          {reviewsLoading ? (
            <p className="text-center text-gray-600">Загрузка отзывов...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p>{review.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Отзывов пока нет</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
