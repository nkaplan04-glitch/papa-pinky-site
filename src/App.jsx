import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>Page not found.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
import Home from './pages/Home';
import About from './pages/About';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Suggestions from './pages/Suggestions';
import Terms from './pages/Terms';
import HouseDashboard from './pages/HouseDashboard';
import ChefDashboard from './pages/ChefDashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<div className="home-bg"><Home /></div>} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/suggestions"
            element={
              <ProtectedRoute allowedRole="house">
                <Suggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/house/:houseId"
            element={
              <ProtectedRoute allowedRole="house">
                <HouseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chef"
            element={
              <ProtectedRoute allowedRole="chef">
                <ChefDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
