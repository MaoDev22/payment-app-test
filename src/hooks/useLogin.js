import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { login } from 'services/userService';
import { setAuthToken } from 'store';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(email, password);
      const { access_token } = response;

      await dispatch(setAuthToken(access_token));
      
      const searchParams = new URLSearchParams(location.search);
      const redirectPayment = searchParams.get('redirectPayment');

      if (!!redirectPayment) {
        navigate(`/${redirectPayment}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
