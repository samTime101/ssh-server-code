import { Navigate } from 'react-router-dom';
import type { User } from '@/types/auth';

const RootRedirect = () => {
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');

  if (token && userString) {
    try {
      const user: User = JSON.parse(userString);

      if (user.is_superuser) {
        return <Navigate to="/adminpanel" />;
      }
      if (user.is_staff) {
        return <Navigate to="/teacherpanel" />;
      }
      return <Navigate to="/userpanel" />;
    } catch (error) {
      // If there's an error parsing user data, clear the invalid data and show login page
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return <Navigate to="/login" />;
    }
  }

  return <Navigate to="/login" />;
};

export default RootRedirect;
