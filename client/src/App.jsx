import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import StudentCatalog from './components/StudentCatalog';
import Login from './components/Login';
import CheckoutOverview from './components/CheckoutOverview';
import StudentRentals from './components/StudentRentals';
import CartDrawer from './components/CartDrawer';
import { useAppContext } from './context/AppContext';

function ProtectedRoute({ children, role }) {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen font-sans antialiased">
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><StudentCatalog /></ProtectedRoute>} />
          <Route path="/rentals" element={<ProtectedRoute><StudentRentals /></ProtectedRoute>} />
          <Route path="/checkout-overview" element={<ProtectedRoute><CheckoutOverview /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
