import { Heart, Star, GitCompare, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ProductDTO } from '../types/api';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: ProductDTO;
  isFavorite: boolean;
  isInCompare: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onAddToCart: (id: number) => void;
  onClick: (id: number) => void;
}

export function ProductCard({
  product,
  isFavorite,
  isInCompare,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  const isOutOfStock = product.quantity === 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
      {isOutOfStock && (
        <Badge className="absolute top-4 left-4 z-10 bg-red-500">
          Нет в наличии
        </Badge>
      )}
      
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={() => onClick(product.id)}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            size="icon"
            variant={isFavorite ? 'default' : 'secondary'}
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant={isInCompare ? 'default' : 'secondary'}
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product.id);
            }}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div onClick={() => onClick(product.id)}>
          <p className="text-sm text-gray-500">{product.brandName}</p>
          <h3 className="line-clamp-2 mt-1">
            {product.title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600">
          {product.categoryName}
        </p>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between pt-2 gap-2">
          <div>
            <p className="text-primary">{product.price.toFixed(2)} BYN</p>
            {product.quantity > 0 && product.quantity < 10 && (
              <p className="text-xs text-orange-600">Осталось: {product.quantity} шт</p>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            disabled={isOutOfStock}
            className="gap-1"
          >
            <ShoppingCart className="h-3 w-3" />
            <span className="hidden sm:inline">В корзину</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
