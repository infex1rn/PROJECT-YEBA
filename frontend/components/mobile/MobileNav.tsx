'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';

interface MobileNavProps {
  cartCount?: number;
}

export function MobileNav({ cartCount = 0 }: MobileNavProps) {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Detect current route
    const path = window.location.pathname;
    if (path.includes('/marketplace') || path.includes('/search')) {
      setActiveTab('search');
    } else if (path.includes('/cart')) {
      setActiveTab('cart');
    } else if (path.includes('/profile') || path.includes('/account')) {
      setActiveTab('profile');
    } else {
      setActiveTab('home');
    }
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/m/' },
    { id: 'search', icon: Search, label: 'Search', href: '/m/marketplace' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', href: '/m/cart', badge: cartCount },
    { id: 'profile', icon: User, label: 'Profile', href: '/m/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
