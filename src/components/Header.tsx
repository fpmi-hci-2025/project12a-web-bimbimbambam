import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartItemsCount: number;
  favoritesCount: number;
}

export function Header({ cartItemsCount, favoritesCount }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="cursor-pointer font-bold" onClick={() => navigate('/')}>
          bimbimbambam
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate('/favorites')}>
            <Heart />
            {favoritesCount > 0 && <Badge>{favoritesCount}</Badge>}
          </Button>

          <Button variant="ghost" onClick={() => navigate('/cart')}>
            <ShoppingCart />
            {cartItemsCount > 0 && <Badge>{cartItemsCount}</Badge>}
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate(isAuthenticated ? '/account' : '/auth')}
          >
            <User />
            {isAuthenticated ? user?.username : 'Войти'}
          </Button>
        </div>
      </div>
    </header>
  );
}
