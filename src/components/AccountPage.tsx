import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { userAPI, ordersAPI } from '../services/api';
import { OrderDTO } from '../types/api';
import {
  ArrowLeft,
  User,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';

/* ======================================================
   ACCOUNT PAGE
====================================================== */

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  /* ======================================================
     LOAD USER + ORDERS
  ====================================================== */

  useEffect(() => {
    if (!user) return;

    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });

    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const ordersData = await ordersAPI.getUserOrders();
      setOrders(
        ordersData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    } catch {
      toast.error('Не удалось загрузить заказы');
    }
  };

  /* ======================================================
     PROFILE UPDATE
  ====================================================== */

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      await userAPI.updateUser(user.id, formData);
      await refreshUser();
      toast.success('Профиль успешно обновлен');
      setIsEditMode(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ошибка обновления профиля'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  /* ======================================================
     HELPERS
  ====================================================== */

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
        return 'Отменен';
      default:
        return status;
    }
  };

  /* ======================================================
     GUARD
  ====================================================== */

  if (!user) {
    return null;
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{user.username}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Профиль
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="w-4 h-4 mr-2" />
                  Заказы ({orders.length})
                </TabsTrigger>
              </TabsList>

              {/* PROFILE */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Личная информация</CardTitle>
                        <CardDescription>
                          Управление данными аккаунта
                        </CardDescription>
                      </div>
                      {!isEditMode && (
                        <Button onClick={() => setIsEditMode(true)}>
                          Редактировать
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <form
                      onSubmit={handleUpdateProfile}
                      className="space-y-4"
                    >
                      {/* Username */}
                      <div className="space-y-2">
                        <Label>Имя пользователя</Label>
                        <Input
                          value={formData.username}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          disabled={!isEditMode || isLoading}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditMode || isLoading}
                          required
                        />
                      </div>

                      {/* Names */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Имя</Label>
                          <Input
                            value={formData.firstName}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            disabled={!isEditMode || isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Фамилия</Label>
                          <Input
                            value={formData.lastName}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            disabled={!isEditMode || isLoading}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={formData.phone}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          disabled={!isEditMode || isLoading}
                        />
                      </div>

                      {/* PASSWORD */}
                      {isEditMode && (
                        <>
                          <Separator />

                          <div className="space-y-2">
                            <Label>Новый пароль</Label>
                            <Input
                              type="password"
                              value={formData.password}
                              onChange={e =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              disabled={isLoading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Подтверждение пароля</Label>
                            <Input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={e =>
                                setFormData({
                                  ...formData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              disabled={isLoading}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading}>
                              Сохранить
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditMode(false);
                                setFormData({
                                  username: user.username,
                                  email: user.email,
                                  firstName: user.firstName || '',
                                  lastName: user.lastName || '',
                                  phone: user.phone || '',
                                  password: '',
                                  confirmPassword: '',
                                });
                              }}
                            >
                              Отмена
                            </Button>
                          </div>
                        </>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ORDERS */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>История заказов</CardTitle>
                    <CardDescription>
                      Все ваши заказы
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-center text-gray-600 py-12">
                        У вас пока нет заказов
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div
                            key={order.id}
                            className="border rounded-lg p-4 hover:shadow cursor-pointer"
                            onClick={() =>
                              navigate(`/order/${order.id}`)
                            }
                          >
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">
                                Заказ №{order.id}
                              </p>
                              <Badge
                                className={getStatusColor(order.status)}
                              >
                                {getStatusText(order.status)}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString(
                                'ru-RU'
                              )}
                            </p>

                            <p className="mt-2 font-medium">
                              {order.totalPrice.toFixed(2)} BYN
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
