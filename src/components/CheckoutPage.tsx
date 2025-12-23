import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Separator } from './ui/separator';
import { CartDTO } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
} from 'lucide-react';

interface CheckoutPageProps {
  cart: CartDTO;
}

export function CheckoutPage({ cart }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    contactPhone: user?.phone || '',
  });

  /* ---------------------------------------------
     SUBMIT ORDER
  --------------------------------------------- */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.deliveryAddress.trim()) {
      toast.error('Укажите адрес доставки');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await ordersAPI.createOrder(
        formData.deliveryAddress,
        formData.contactPhone || undefined
      );

      toast.success('Заказ успешно создан');
      navigate(`/order/${order.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ошибка создания заказа'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------------------------------------------
     EMPTY CART
  --------------------------------------------- */
  if (cart.totalQuantity === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Корзина пуста</h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары для оформления заказа
          </p>
          <Button onClick={() => navigate('/')}>
            Перейти к покупкам
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl mb-8">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =========================================
              FORM
          ========================================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Адрес доставки
                </CardTitle>
                <CardDescription>
                  Укажите адрес, куда доставить заказ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес *</Label>
                    <Input
                      id="address"
                      value={formData.deliveryAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryAddress: e.target.value,
                        })
                      }
                      placeholder="Город, улица, дом, квартира"
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Контактный телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+375 XX XXX-XX-XX"
                      disabled={isProcessing}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Order items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Состав заказа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.items.map(item => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.productTitle}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {item.productTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} ×{' '}
                          {item.pricePerUnit.toFixed(2)} BYN
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.quantity * item.pricePerUnit).toFixed(2)} BYN
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* =========================================
              SUMMARY
          ========================================= */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Товары ({cart.totalQuantity})
                    </span>
                    <span>
                      {cart.totalPrice.toFixed(2)} BYN
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка</span>
                    <span className="text-green-600">
                      Бесплатно
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">К оплате:</span>
                  <span className="text-2xl font-medium">
                    {cart.totalPrice.toFixed(2)} BYN
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleSubmit()}
                  disabled={
                    isProcessing ||
                    !formData.deliveryAddress.trim()
                  }
                >
                  {isProcessing ? (
                    'Обработка...'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Оформить заказ
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  После оформления вы перейдёте на страницу заказа
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
