import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'sonner';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';

type Mode = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const redirectTo =
    (location.state as any)?.from?.pathname || '/';

  /* =========================
     VALIDATION
  ========================= */

  const validateSignIn = () => {
    if (!form.username || !form.password) {
      toast.error('Введите логин и пароль');
      return false;
    }
    return true;
  };

  const validateSignUp = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Заполните все обязательные поля');
      return false;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      toast.error('Логин: 3–20 символов, латиница, цифры, "_"');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error('Введите корректный email');
      return false;
    }

    if (form.password.length < 8 || form.password.length > 32) {
      toast.error('Пароль должен быть от 8 до 32 символов');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Пароли не совпадают');
      return false;
    }

    if (form.firstName && form.firstName.length > 30) {
      toast.error('Имя слишком длинное');
      return false;
    }

    if (form.lastName && form.lastName.length > 30) {
      toast.error('Фамилия слишком длинная');
      return false;
    }

    if (form.phone && !/^[0-9+\-() ]{3,20}$/.test(form.phone)) {
      toast.error('Некорректный номер телефона');
      return false;
    }

    return true;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        if (!validateSignIn()) return;
        await login(form.username, form.password);
        toast.success('Вы успешно вошли');
        navigate(redirectTo, { replace: true });
      } else {
        if (!validateSignUp()) return;
        await authAPI.signUp(form);
        toast.success('Регистрация успешна. Теперь войдите.');
        setMode('signin');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Ошибка'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     ALREADY AUTH
  ========================= */

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2 self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <CardTitle>
            {mode === 'signin' ? 'Вход' : 'Регистрация'}
          </CardTitle>

          <CardDescription>
            {mode === 'signin'
              ? 'Войдите в свой аккаунт'
              : 'Создайте новый аккаунт'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* MODE SWITCH */}
          <div className="grid grid-cols-2 gap-2 mb-4 w-full">
            <Button
              variant={mode === 'signin' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setMode('signin')}
            >
              Вход
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setMode('signup')}
            >
              Регистрация
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Логин <span className="text-red-500">*</span></Label>
              <Input value={form.username} onChange={e => update('username', e.target.value)} />
            </div>

            {mode === 'signup' && (
              <div>
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
            )}

            <div>
              <Label>Пароль <span className="text-red-500">*</span></Label>
              <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <Label>Подтвердите пароль <span className="text-red-500">*</span></Label>
                  <Input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                </div>

                <div>
                  <Label>Имя</Label>
                  <Input value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                </div>

                <div>
                  <Label>Фамилия</Label>
                  <Input value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                </div>

                <div>
                  <Label>Телефон</Label>
                  <Input
                    placeholder="+375 (__) ___-__-__"
                    value={form.phone}
                    onChange={e =>
                      update(
                        'phone',
                        e.target.value.replace(/[^0-9+\-() ]/g, '')
                      )
                    }
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? 'Загрузка...'
                : mode === 'signin'
                ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </>
                )
                : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Зарегистрироваться
                  </>
                )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
