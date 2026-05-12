import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import ListingDetail from './components/ListingDetail';
import Profile from './components/Profile';
import NGOVerification from './components/NGOVerification';
import SupportNGOs from './components/SupportNGOs';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import Favorites from './components/Favorites';
import MyDonations from './components/MyDonations';
import UserLayout from './components/UserLayout';
import Navbar from './components/Navbar';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import { useLocation as useLocationRouter, Navigate } from 'react-router-dom';

const UserPageRoute = ({ element, user, onLogout }) => {
  return <UserLayout user={user} onLogout={onLogout}>{element}</UserLayout>;
};

function ProtectedAdminRoute({ user, children }) {
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocationRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem('pet-app-user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Normalize id/_id
    if (user._id && !user.id) user.id = user._id;
    if (user.id && !user._id) user._id = user.id;
    return user;
  });
  const navigate = useNavigate();
  const location = useLocationRouter();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pet-app-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pet-app-user');
      localStorage.removeItem('pet-app-token');
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar user={currentUser} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<Home user={currentUser} />} />
          <Route path="/support" element={<SupportNGOs user={currentUser} />} />
          <Route path="/login" element={<AuthForm mode="login" onAuth={setCurrentUser} />} />
          <Route path="/register" element={<AuthForm mode="register" onAuth={setCurrentUser} />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<UserPageRoute user={currentUser} onLogout={logout} element={<Dashboard user={currentUser} />} />} />
          <Route path="/profile" element={<UserPageRoute user={currentUser} onLogout={logout} element={<Profile user={currentUser} onUpdate={setCurrentUser} />} />} />
          <Route path="/favorites" element={<UserPageRoute user={currentUser} onLogout={logout} element={<Favorites user={currentUser} />} />} />
          <Route path="/my-donations" element={<UserPageRoute user={currentUser} onLogout={logout} element={<MyDonations user={currentUser} />} />} />
          <Route path="/verify-ngo" element={<NGOVerification user={currentUser} />} />
          <Route path="/listing/:id" element={<ListingDetail user={currentUser} />} />
          <Route path="/admin" element={<ProtectedAdminRoute user={currentUser}><AdminPanel user={currentUser} /></ProtectedAdminRoute>} />
          <Route path="/settings" element={<UserPageRoute user={currentUser} onLogout={logout} element={<Settings user={currentUser} />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
