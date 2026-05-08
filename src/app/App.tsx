import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductCatalogPage } from './pages/customer/ProductCatalogPage';
import { ShoppingCartPage } from './pages/customer/ShoppingCartPage';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage';
import { SalesDashboardPage } from './pages/sales/SalesDashboardPage';
import { OrderManagementPage } from './pages/sales/OrderManagementPage';
import { BusinessDashboardPage } from './pages/business/BusinessDashboardPage';
import { ProductManagementPage } from './pages/business/ProductManagementPage';
import { TechnicalDashboardPage } from './pages/technical/TechnicalDashboardPage';
import { UserManagementPage } from './pages/technical/UserManagementPage';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { CartItem } from '../data/ui_types/models';


function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
    navigate('/customer/orders');
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
        userName={user.name}
        userRole={getRoleDisplayName(user.role)}
        onLogout={logout}
      >
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to={roleBasedDefaultPath[user.role]} replace />} />

          {/* Customer Routes */}
          {user.role === 'customer' && (
            <>
              <Route path="/customer" element={
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <p className="text-muted-foreground">Discover the latest technology products</p>
                  </div>
                  <ProductCatalogPage onAddToCart={handleAddToCart} />
                </div>
              } />
              <Route path="/customer/products" element={<ProductCatalogPage onAddToCart={handleAddToCart} />} />
              <Route path="/customer/cart" element={
                <ShoppingCartPage
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              } />
              <Route path="/customer/orders" element={<OrderHistoryPage />} />
            </>
          )}

          {/* Sales Routes */}
          {user.role === 'sales' && (
            <>
              <Route path="/sales" element={<SalesDashboardPage />} />
              <Route path="/sales/orders" element={<OrderManagementPage />} />
            </>
          )}

          {/* Business Routes */}
          {user.role === 'business' && (
            <>
              <Route path="/business" element={<BusinessDashboardPage />} />
              <Route path="/business/products" element={<ProductManagementPage />} />
            </>
          )}

          {/* Technical Routes */}
          {user.role === 'technical' && (
            <>
              <Route path="/technical" element={<TechnicalDashboardPage />} />
              <Route path="/technical/users" element={<UserManagementPage />} />
            </>
          )}

          {/* Catch all */}
          <Route path="*" element={
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Page Not Found</h2>
                <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate(roleBasedDefaultPath[user.role])}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          } />
        </Routes>
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
