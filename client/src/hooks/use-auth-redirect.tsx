import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authContext?.isAuthenticated, navigate]);
};

export default useAuthRedirect;
