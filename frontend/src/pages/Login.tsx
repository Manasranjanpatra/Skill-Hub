import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FaEye, FaEyeSlash, FaUser, FaChalkboardTeacher, FaShieldAlt } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './Login.css';

const Login: React.FC = () => {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Unified login form state
  const [loginData, setLoginData] = useState({
    identifier: '', // Can be studentId, email, or admin email
    password: ''
  });

  // Registration form state
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTeacherRegistration, setShowTeacherRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    board: '',
    password: '',
    confirmPassword: ''
  });
  
  const [teacherRegistrationData, setTeacherRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!loginData.identifier || !loginData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Determine login type based on identifier format
      let loginEndpoint = '';
      let requestData = {};
      
      if (loginData.identifier === 'admin@eduyata.com' || loginData.identifier === 'admin') {
        // Admin login
        loginEndpoint = 'http://localhost:8080/api/auth/admin/login';
        requestData = {
          email: loginData.identifier === 'admin' ? 'admin@eduyata.com' : loginData.identifier,
          password: loginData.password
        };
      } else if (loginData.identifier.includes('@')) {
        // Teacher login (email format)
        loginEndpoint = 'http://localhost:8080/api/auth/teacher/login';
        requestData = {
          email: loginData.identifier,
          password: loginData.password
        };
      } else {
        // Student login (student ID format)
        loginEndpoint = 'http://localhost:8080/api/auth/student/login';
        requestData = {
          studentId: loginData.identifier,
          password: loginData.password
        };
      }

      console.log('Attempting login with:', requestData);
      
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      console.log('Login response:', result);
      
      if (response.ok) {
        // Handle different response formats
        if (loginEndpoint.includes('admin')) {
          // Admin login success
          localStorage.setItem('admin_token', result.token);
          SessionManager.saveSession({
            id: result.user.id,
            admin_id: result.user.admin_id,
            name: result.user.name,
            email: result.user.email,
            role: 'admin'
          });
          navigate('/admin-dashboard');
        } else if (loginEndpoint.includes('teacher')) {
          // Teacher login success
          SessionManager.saveSession(result.data);
          navigate('/teacher-dashboard');
        } else {
          // Student login success
          SessionManager.saveSession(result.data);
          navigate('/dashboard');
        }
      } else {
        setError(result.error || result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!registrationData.name || !registrationData.phone || !registrationData.class || !registrationData.board || !registrationData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }
    
    try {
      const backendData = {
        name: registrationData.name,
        mobile_self: registrationData.phone,
        class_level: registrationData.class,
        board: registrationData.board,
        password: registrationData.password
      };
      
      const response = await fetch('http://localhost:8080/api/auth/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Registration successful!\n\nYour Student ID is: ${result.student_id}\n\nPlease save this ID for login.`);
        if (result.data) {
          SessionManager.saveSession(result.data);
        }
        navigate('/profile-completion');
      } else {
        setError(result.error || result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleTeacherRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleTeacherRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!teacherRegistrationData.name || !teacherRegistrationData.email || !teacherRegistrationData.phone || !teacherRegistrationData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    if (teacherRegistrationData.password !== teacherRegistrationData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teacherRegistrationData.name,
          email: teacherRegistrationData.email,
          phone: teacherRegistrationData.phone,
          password: teacherRegistrationData.password
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Teacher registration successful! Please check your email for verification.');
        setShowTeacherRegistration(false);
      } else {
        setError(result.error || result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Teacher registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className={`login-container ${showRegistration ? 'registration-mode' : ''}`}>
        {/* Main Login Panel */}
        <div className="login-panel login-panel-form login-panel-left active">
          <div className="login-panel-content">
            <h2 className="login-title">
              {showRegistration ? 'Student Registration' : showTeacherRegistration ? 'Teacher Registration' : 'Login to Eduyata'}
            </h2>
            
            {!showRegistration && !showTeacherRegistration ? (
              // Unified Login Form
              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input 
                    type="text" 
                    name="identifier"
                    placeholder="Student ID / Teacher Email" 
                    className="login-input" 
                    value={loginData.identifier}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      placeholder="Password" 
                      className="login-input" 
                      value={loginData.password}
                      onChange={handleLoginChange}
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
                </div>
                {error && <div className="login-error">{error}</div>}
                <a href="#" className="login-forgot">Forgot your password?</a>
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="signup-links">
                  <div className="login-signup-link">
                    Don't have a student account?{' '}
                    <button 
                      type="button" 
                      className="login-link-btn" 
                      onClick={() => setShowRegistration(true)}
                    >
                      Sign up here
                    </button>
                  </div>
                  <div className="teacher-register-link">
                    Teacher?{' '}
                    <button 
                      type="button" 
                      className="login-link-btn" 
                      onClick={() => navigate('/creative-teacher-register')}
                    >
                      Register as Teacher
                    </button>
                  </div>
                </div>
              </form>
            ) : showRegistration ? (
              // Student Registration Form
              <form className="login-form" onSubmit={handleRegistration}>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  className="login-input" 
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  className="login-input" 
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  className="login-input" 
                  value={registrationData.phone}
                  onChange={handleRegistrationChange}
                  required
                />
                <select 
                  name="class"
                  className="login-input" 
                  value={registrationData.class}
                  onChange={handleRegistrationChange}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
                <select 
                  name="board"
                  className="login-input" 
                  value={registrationData.board}
                  onChange={handleRegistrationChange}
                  required
                >
                  <option value="">Select Board</option>
                  <option value="cbse">CBSE</option>
                  <option value="icse">ICSE</option>
                  <option value="state">State Board</option>
                  <option value="igcse">IGCSE</option>
                </select>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="login-input" 
                  value={registrationData.password}
                  onChange={handleRegistrationChange}
                  required
                />
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  className="login-input" 
                  value={registrationData.confirmPassword}
                  onChange={handleRegistrationChange}
                  required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="login-signup-link">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="login-link-btn" 
                    onClick={() => setShowRegistration(false)}
                  >
                    Login here
                  </button>
                </div>
              </form>
            ) : (
              // Teacher Registration Form
              <form className="login-form" onSubmit={handleTeacherRegistration}>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  className="login-input" 
                  value={teacherRegistrationData.name}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  className="login-input" 
                  value={teacherRegistrationData.email}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  className="login-input" 
                  value={teacherRegistrationData.phone}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="login-input" 
                  value={teacherRegistrationData.password}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  className="login-input" 
                  value={teacherRegistrationData.confirmPassword}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Teacher Account'}
                </button>
                <div className="login-signup-link">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="login-link-btn" 
                    onClick={() => setShowTeacherRegistration(false)}
                  >
                    Login here
                  </button>
                </div>
              </form>
            )}
            
            <div className="login-help">For help, contact <a href="mailto:support@eduyata.com">support@eduyata.com</a></div>
          </div>
        </div>
        
        {/* Welcome Panel */}
        <div className="login-panel login-panel-welcome login-panel-right gradient-bg active">
          <div className="login-welcome-panel-content">
            <h2 className="login-welcome">
              {showRegistration ? 'Join Eduyata!' : showTeacherRegistration ? 'Become an Educator!' : 'Welcome to Eduyata!'}
            </h2>
            <p className="login-desc">
              {showRegistration 
                ? 'Create your student account and start your learning journey with us.' 
                : showTeacherRegistration
                ? 'Join our community of educators and share your knowledge with students worldwide.'
                : 'Your unified platform for learning and teaching. Login with your credentials to access your personalized dashboard.'}
            </p>
            <div className="login-features">
              <div className="feature-item">🎓 Students: Interactive Learning</div>
              <div className="feature-item">👨‍🏫 Teachers: Course Management</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional CSS for unified login
const unifiedLoginStyles = `
.login-type-hint {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.login-input {
  width: 100%;
  box-sizing: border-box;
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

.login-error {
  color: #e53e3e;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-align: center;
  padding: 0.5rem;
  background: #fee2e2;
  border-radius: 4px;
}

.signup-links {
  margin-top: 0.5rem;
}

.login-signup-link,
.teacher-register-link {
  margin: 0.2rem 0;
  text-align: center;
  font-size: 0.9rem;
}

.login-features {
  margin-top: 1.5rem;
}

.feature-item {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.login-desc {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 300;
  letter-spacing: 0.5px;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = unifiedLoginStyles;
  document.head.appendChild(styleSheet);
}

export default Login;