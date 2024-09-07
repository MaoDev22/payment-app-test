import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { validateToken } from 'services/authService';

import router from 'Router';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const indexRoute = router.routes[0];
      const routeGeted = indexRoute.children.find(route => indexRoute.path+route.path === location.pathname);
      const requiresAuth = routeGeted?.requiresAuth;

      if (requiresAuth) {
        try {
          await validateToken();
        } catch (e) {
          toast.error(e.message);
        }
      }
    }

    authenticate();
  }, [location, navigate]);

  return (
    <>
      <ToastContainer />
      <Header />
      <main style={{marginTop: "80px"}}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
