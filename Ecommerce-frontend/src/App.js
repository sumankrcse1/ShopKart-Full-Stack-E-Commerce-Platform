import logo from './logo.svg';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CustomerRouters from './Routers/CustomerRouters.jsx';
import Product from './customer/components/Product/Product.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { getUser } from './Redux/Auth/Action.js';
import AdminRoutes from './Routers/AdminRoutes.jsx';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = localStorage.getItem('jwt');
  const { user, isLoading } = useSelector((store) => store.auth);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch]);

  // Redirect admin users to admin panel after login - only once
  useEffect(() => {
    // Only redirect if user is loaded, not already redirected, and not already on admin route
    if (user && user.role === 'ADMIN' && !hasRedirected.current && !location.pathname.startsWith('/admin')) {
      const publicRoutes = ['/', '/login', '/register', '/home'];
      if (publicRoutes.includes(location.pathname)) {
        hasRedirected.current = true;
        navigate('/admin/dashboard', { replace: true });
      }
    }

    // Reset redirect flag when user changes or logs out
    if (!user) {
      hasRedirected.current = false;
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path='/*' element={<CustomerRouters />}></Route>
      </Routes>
    </div>
  );
}

export default App;
