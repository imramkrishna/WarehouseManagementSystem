import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginForm } from './components/auth/LoginForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { InventoryList } from './components/inventory/InventoryList';
import { OrderList } from './components/orders/OrderList';
import { WarehouseList } from './components/warehouse/WarehouseList';
import { SupplierList } from './components/suppliers/SupplierList';
import { ReportDashboard } from './components/reports/ReportDashboard';
import { UserProfile } from './components/auth/UserProfile';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Outlet />
                      </AppLayout>
                    </AuthGuard>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="inventory/*" element={<InventoryList />} />
                  <Route path="orders/*" element={<OrderList />} />
                  <Route path="warehouses/*" element={<WarehouseList />} />
                  <Route path="suppliers/*" element={<SupplierList />} />
                  <Route path="reports/*" element={<ReportDashboard />} />
                  <Route path="profile" element={<UserProfile />} />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;