import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Suggestions from './pages/Suggestions';
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
        </Routes>
      </main>
    </>
  );
}
