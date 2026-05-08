import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { ShoppingCart } from './components/customer/ShoppingCart';
import { OrderHistory } from './components/customer/OrderHistory';
import { SalesDashboard } from './components/sales/SalesDashboard';
import { OrderManagement } from './components/sales/OrderManagement';
import { BusinessDashboard } from './components/business/BusinessDashboard';
import { ProductManagement } from './components/business/ProductManagement';
import { TechnicalDashboard } from './components/technical/TechnicalDashboard';
import { UserManagement } from './components/technical/UserManagement';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

interface CartItem {
  productId: string;
  quantity: number;
}

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!user) {
    return <LoginPage />;
  }

  const roleBasedDefaultPath: Record<string, string> = {
    customer: '/customer',
    sales: '/sales',
    business: '/business',
    technical: '/technical',
  };

  const activePath = currentPath || roleBasedDefaultPath[user.role];

  const handleAddToCart = (productId: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    setCartItems([]);
    setShowCheckoutModal(false);
    setCurrentPath('/customer/orders');
  };

  const renderContent = () => {
    switch (user.role) {
      case 'customer':
        if (activePath === '/customer/products') {
          return <ProductCatalog onAddToCart={handleAddToCart} />;
        }
        if (activePath === '/customer/cart') {
          return (
            <ShoppingCart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          );
        }
        if (activePath === '/customer/orders') {
          return <OrderHistory />;
        }
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-muted-foreground">Discover the latest technology products</p>
            </div>
            <ProductCatalog onAddToCart={handleAddToCart} />
          </div>
        );

      case 'sales':
        if (activePath === '/sales/orders') {
          return <OrderManagement />;
        }
        return <SalesDashboard />;

      case 'business':
        if (activePath === '/business/products') {
          return <ProductManagement />;
        }
        return <BusinessDashboard />;

      case 'technical':
        if (activePath === '/technical/users') {
          return <UserManagement />;
        }
        return <TechnicalDashboard />;

      default:
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome to TechSales</h2>
              <p className="text-muted-foreground">Select a page from the sidebar</p>
            </div>
          </div>
        );
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      customer: 'Customer',
      sales: 'Sales Staff',
      business: 'Business Admin',
      technical: 'Technical Admin',
    };
    return roleNames[role] || role;
  };

  return (
    <>
      <DashboardLayout
        role={user.role}
        currentPath={activePath}
        onNavigate={setCurrentPath}
        userName={user.name}
        userRole={getRoleDisplayName(user.role)}
        onLogout={logout}
      >
        {renderContent()}
      </DashboardLayout>

      <Modal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        title="Checkout"
        description="Complete your order"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCheckoutModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCheckout}>
              Confirm Order
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>Your order has been placed successfully!</p>
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
