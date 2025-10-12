'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ListOrdered, 
  Settings, 
  LogOut,
  Layers
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Orders', href: '/admin/orders', icon: ListOrdered },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { handleLogout } = useAuth();

  return (
    <div className="h-full flex flex-col bg-white border-r w-64">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-md hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}