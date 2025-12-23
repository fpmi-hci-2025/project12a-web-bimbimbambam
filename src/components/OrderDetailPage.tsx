import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
} from 'lucide-react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

import { OrderDTO } from '../types/api';
import { ordersAPI } from '../services/api';
import { toast } from 'sonner';

/* ======================================================
   ORDER DETAIL PAGE (ROUTER-BASED)
====================================================== */

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  /* ---------------------------------------------
     LOAD ORDER
  --------------------------------------------- */
  useEffect(() => {
    if (!id) return;
    loadOrder(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrder = async (orderId: number) => {
    setIsLoading(true);
    try {
      const data = await ordersAPI.getOrderById(orderId);
      setOrder(data);
    } catch {
      toast.error('Не удалось загрузить заказ');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------
     PAY ORDER
  --------------------------------------------- */
  const handlePayment = async () => {
    if (!order) return;

    setIsPaying(true);
    try {
      const updated = await ordersAPI.payOrder(order.id);
      setOrder(updated);
      toast.success('Заказ успешно оплачен');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Ошибка оплаты'
      );
    } finally {
      setIsPaying(false);
    }
  };

  /* ---------------------------------------------
     STATUS HELPERS
  --------------------------------------------- */
  const getStatusColor = (status: OrderDTO['status']) => {
    switch (status) {
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderDTO['status']) => {
    switch (status) {
      case 'CREATED':
        return 'Создан';
      case 'PAID':
        return 'Оплачен';
      case 'SHIPPING':
        return 'Доставка';
      case 'COMPLETED':
        return 'Выполнен';
      case 'CANCELLED':
        return 'Отменён';
      default:
        return status;
    }
  };

  /* ---------------------------------------------
     LOADING
  --------------------------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <p className="text-center text-gray-600">Загрузка...</p>
      </div>
    );
  }

  /* ---------------------------------------------
     NOT FOUND
  --------------------------------------------- */
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl mb-2">Заказ не найден</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Вернуться назад
        </Button>
      </div>
    );
  }

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Заказ №{order.id}</h1>
            <p className="text-gray-600">
              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>

        {/* Payment reminder */}
        {order.status === 'CREATED' && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Clock className="w-4 h-4" />
            <AlertDescription>
              Заказ ожидает оплаты
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Состав заказа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div
                      key={item.productId}
                      className="flex justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {item.productTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} ×{' '}
                          {item.priceAtPurchase.toFixed(2)} BYN
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.quantity * item.priceAtPurchase).toFixed(2)} BYN
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-medium">
                  <span>Итого</span>
                  <span>{order.totalPrice.toFixed(2)} BYN</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Доставка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p>{order.deliveryAddress}</p>
                </div>

                {order.contactPhone && (
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p>{order.contactPhone}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Оплата</CardTitle>
                <CardDescription>
                  {order.status === 'CREATED'
                    ? 'Завершите оплату'
                    : 'Информация об оплате'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары</span>
                    <span>{order.totalPrice.toFixed(2)} BYN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Итого</span>
                    <span>{order.totalPrice.toFixed(2)} BYN</span>
                  </div>
                </div>

                {order.status === 'CREATED' && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isPaying}
                  >
                    {isPaying ? (
                      'Обработка...'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Оплатить заказ
                      </>
                    )}
                  </Button>
                )}

                {order.status === 'PAID' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription>
                      Заказ оплачен
                    </AlertDescription>
                  </Alert>
                )}

                {(order.status === 'SHIPPING' ||
                  order.status === 'COMPLETED') && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <AlertDescription>
                      {order.status === 'SHIPPING'
                        ? 'Заказ в пути'
                        : 'Заказ доставлен'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
