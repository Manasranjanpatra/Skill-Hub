import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './Login.css';

const AdminLogin: React.FC = () => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: 'admin@eduyata.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', formData);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:8001/api/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.status === 'success') {
        // Store JWT token
        localStorage.setItem('admin_token', data.token);
        
        SessionManager.saveSession({
          id: data.user.id,
          admin_id: data.user.admin_id,
          name: data.user.name,
          email: data.user.email,
          role: 'admin'
        });

        console.log('Admin login successful, navigating to dashboard');
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timeout. Please check if the server is running.');
        } else if (error.message.includes('fetch')) {
          setError('Cannot connect to server. Please ensure Django server is running on port 8001.');
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-container">
        <div className="login-panel login-panel-form login-panel-left active" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="login-panel-content">
            <h2 className="login-title">Admin Access</h2>
            <div className="admin-shield-logo">
              <FaShieldAlt size={32} color="#6C63FF" />
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email"
                placeholder="Admin Email" 
                className="login-input" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  placeholder="Password" 
                  className="login-input" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && <div className="admin-error">{error}</div>}
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Admin Login'}
              </button>
            </form>
            <div className="login-help">🔒 Secure admin portal - All access logged</div>
          </div>
        </div>
        
        <div className="login-panel login-panel-welcome login-panel-right gradient-bg active">
          <div className="login-welcome-panel-content">
            <h2 className="login-welcome">System Administrator</h2>
            <p className="login-desc">
              Welcome to the Eduyata Admin Portal. Manage users, courses, and system settings with secure access.
            </p>
            <div className="admin-features">
              <div className="feature-item">✓ User Management</div>
              <div className="feature-item">✓ Course Administration</div>
              <div className="feature-item">✓ System Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

// Additional CSS for admin-specific styling
const adminStyles = `
.admin-shield-logo {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6C63FF;
  cursor: pointer;
  padding: 4px;
}

.admin-error {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

.admin-features {
  margin-top: 1.5rem;
}

.feature-item {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  opacity: 0.9;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = adminStyles;
  document.head.appendChild(styleSheet);
}
