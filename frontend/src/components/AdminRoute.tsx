import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import SessionManager from '../utils/sessionManager';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [, navigate] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const session = SessionManager.getSession();
      const token = localStorage.getItem('admin_token');

      if (!session || session.role !== 'admin' || !token) {
        navigate('/admin-login');
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAdminAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Verifying admin access...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#ef4444'
      }}>
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this area.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
