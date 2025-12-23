import { useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { CartDTO } from '../types/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CartPageProps {
  cart: CartDTO;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartPage({
  cart,
  onUpdateQuantity,
  onRemove,
}: CartPageProps) {
  const navigate = useNavigate();

  const delivery = cart.totalPrice > 500 ? 0 : 10;
  const total = cart.totalPrice + delivery;

  /* ======================================================
     EMPTY CART
  ====================================================== */

  if (cart.totalQuantity === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад к каталогу
        </Button>

        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="mb-4">Корзина пуста</h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары в корзину, чтобы продолжить покупки
          </p>
          <Button onClick={() => navigate('/')}>
            Перейти к каталогу
          </Button>
        </div>
      </div>
    );
  }

  /* ======================================================
     CART
  ====================================================== */

  return (
    <div className="container mx-auto px-4 py-6">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </Button>

      <h1 className="mb-6">
        Корзина ({cart.totalQuantity})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div
              key={item.productId}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4 mb-2">
                    <div>
                      <h3 className="line-clamp-2">
                        {item.productTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.pricePerUnit.toFixed(2)} BYN за шт.
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-12 text-center">
                        {item.quantity}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= 99}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-primary">
                        {(item.pricePerUnit * item.quantity).toFixed(2)} BYN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-20">
            <h3 className="mb-4">Итого</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Товары ({cart.totalQuantity})
                </span>
                <span>
                  {cart.totalPrice.toFixed(2)} BYN
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Доставка
                </span>
                <span>
                  {delivery === 0 ? (
                    <span className="text-green-600">
                      Бесплатно
                    </span>
                  ) : (
                    `${delivery.toFixed(2)} BYN`
                  )}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between mb-6">
              <span>Итого</span>
              <span className="text-primary">
                {total.toFixed(2)} BYN
              </span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Оформить заказ
            </Button>

            {cart.totalPrice < 500 && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                Бесплатная доставка от 500 BYN
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
