import { Link, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { LayoutDashboard, Calendar, ShoppingBag, ShoppingCart, BookOpen, Bookmark, User } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();
  const { customer } = useCustomerAuth();

  const getNavigation = () => {
    if (customer?.businessType === 'services') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/customer/services/dashboard' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/customer/services/appointments' },
        { id: 'profile', label: 'Profile', icon: User, path: '/customer/services/profile' },
      ];
    } else if (customer?.businessType === 'ecommerce') {
      return [
        { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/customer/ecommerce/orders' },
        { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/customer/ecommerce/cart' },
        { id: 'profile', label: 'Profile', icon: User, path: '/customer/ecommerce/profile' },
      ];
    } else {
      return [
        { id: 'reading', label: 'Reading', icon: BookOpen, path: '/customer/blogging/reading' },
        { id: 'saved', label: 'Saved', icon: Bookmark, path: '/customer/blogging/saved' },
        { id: 'profile', label: 'Profile', icon: User, path: '/customer/blogging/profile' },
      ];
    }
  };

  const navigation = getNavigation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center px-2 py-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
