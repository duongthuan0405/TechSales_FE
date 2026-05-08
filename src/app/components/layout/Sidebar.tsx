import { ReactNode } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  FileText,
  UserCircle,
  Database,
  Shield
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  role: 'customer' | 'sales' | 'business' | 'technical';
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  path: string;
}

const roleNavItems: Record<string, NavItem[]> = {
  customer: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Home', path: '/customer' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/customer/products' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Cart', path: '/customer/cart' },
    { icon: <FileText className="h-5 w-5" />, label: 'Orders', path: '/customer/orders' },
    { icon: <UserCircle className="h-5 w-5" />, label: 'Profile', path: '/customer/profile' },
  ],
  sales: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/sales' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/sales/orders' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: '/sales/customers' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/sales/products' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', path: '/sales/analytics' },
  ],
  business: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/business' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', path: '/business/analytics' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/business/products' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/business/orders' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: '/business/customers' },
    { icon: <FileText className="h-5 w-5" />, label: 'Reports', path: '/business/reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/business/settings' },
  ],
  technical: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/technical' },
    { icon: <Users className="h-5 w-5" />, label: 'User Management', path: '/technical/users' },
    { icon: <Shield className="h-5 w-5" />, label: 'Roles & Permissions', path: '/technical/roles' },
    { icon: <Database className="h-5 w-5" />, label: 'Database', path: '/technical/database' },
    { icon: <FileText className="h-5 w-5" />, label: 'System Logs', path: '/technical/logs' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/technical/settings' },
  ],
};

export function Sidebar({ role, currentPath, onNavigate }: SidebarProps) {
  const navItems = roleNavItems[role] || [];

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">TechSales</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              currentPath === item.path
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
