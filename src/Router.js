import { createBrowserRouter } from 'react-router-dom';

import Home from 'pages/Home';
import Login from 'pages/Login';
import ShopingCart from 'pages/ShoppingCart';
import NotFound from 'pages/NotFound';
import Layout from 'components/common/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home />, requiresAuth: false },
      { path: 'login', element: <Login />, requiresAuth: false },
      { path: 'shoping-cart', element: <ShopingCart />, requiresAuth: false },
      { path: '*', element: <NotFound />, requiresAuth: false },
    ],
  },
]);

export default router;
