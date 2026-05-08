import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductCatalogPage } from './pages/customer/ProductCatalogPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { HomePage } from './pages/customer/HomePage';
import { ShoppingCartPage } from './pages/customer/ShoppingCartPage';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage';
import { SalesDashboardPage } from './pages/sales/SalesDashboardPage';
import { OrderManagementPage } from './pages/sales/OrderManagementPage';
import { BusinessDashboardPage } from './pages/business/BusinessDashboardPage';
import { ProductManagementPage } from './pages/business/ProductManagementPage';
import { TechnicalDashboardPage } from './pages/technical/TechnicalDashboardPage';
import { UserManagementPage } from './pages/technical/UserManagementPage';
import { Button } from './components/ui/button';
import { Toaster } from 'sonner';


function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <LoginPage />;
  }

  const roleBasedDefaultPath: Record<string, string> = {
    customer: '/customer',
    sales: '/sales',
    business: '/business',
    technical: '/technical',
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
            <Route path="/customer" element={<HomePage />} />
            <Route path="/customer/products" element={<ProductCatalogPage />} />
            <Route path="/customer/products/:id" element={<ProductDetailPage />} />
            <Route path="/customer/cart" element={<ShoppingCartPage />} />
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
