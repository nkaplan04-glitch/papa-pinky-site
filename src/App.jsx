import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Menu from './pages/Menu';
import HouseDashboard from './pages/HouseDashboard';
import ChefDashboard from './pages/ChefDashboard';

function HouseDashboardWrapper() {
  const { houseId } = useParams();
  return (
    <ProtectedRoute allowedRole="house" houseId={houseId}>
      <HouseDashboard />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<div className="home-bg"><Home /></div>} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/house/:houseId"
            element={<HouseDashboardWrapper />}
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
