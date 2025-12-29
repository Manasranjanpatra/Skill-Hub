import React, { useState, useEffect } from 'react';
import { FaBell, FaLock, FaPalette, FaSave } from 'react-icons/fa';
import StudentLayout from '../components/StudentLayout';
import SessionManager, { StudentSession } from '../utils/sessionManager';
import { useLocation } from 'wouter';
import './Settings.css';

interface StudentProfile {
  name: string;
  gender: string;
  mobile_self: string;
  class_level: string;
  board: string;
  date_of_birth: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  interests: string;
  profile_picture: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  assignment_reminders: boolean;
  course_updates: boolean;
  achievement_alerts: boolean;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dashboard_layout: 'compact' | 'detailed';
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile state
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    gender: '',
    mobile_self: '',
    class_level: '',
    board: '',
    date_of_birth: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    interests: '',
    profile_picture: ''
  });

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    assignment_reminders: true,
    course_updates: true,
    achievement_alerts: true
  });

  // App preferences state
  const [preferences, setPreferences] = useState<AppPreferences>({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dashboard_layout: 'detailed'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setStudentSession(session);
    loadUserPreferences(session.id);
  }, [navigate]);

  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const loadStudentProfile = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/student_profile/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setProfile({
          name: data.data.name || '',
          gender: data.data.gender || '',
          mobile_self: data.data.mobile_self || '',
          class_level: data.data.class_level || '',
          board: data.data.board || '',
          date_of_birth: data.data.date_of_birth || '',
          address: data.data.address || '',
          parent_name: data.data.parent_name || '',
          parent_phone: data.data.parent_phone || '',
          interests: data.data.interests || '',
          profile_picture: data.data.profile_picture || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserPreferences = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setNotifications({
          email_notifications: data.data.email_notifications,
          push_notifications: data.data.push_notifications,
          assignment_reminders: data.data.assignment_reminders,
          course_updates: data.data.course_updates,
          achievement_alerts: data.data.achievement_alerts
        });
        setPreferences({
          theme: data.data.theme,
          language: data.data.language,
          timezone: data.data.timezone,
          dashboard_layout: data.data.dashboard_layout
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!studentSession) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...profile
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Profile updated successfully!');
        // Update session data
        const updatedSession = { ...studentSession, ...profile };
        SessionManager.saveSession(updatedSession);
        setStudentSession(updatedSession);
      } else {
        setMessage('Error updating profile: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (!studentSession) return;
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/change_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setMessage('Error changing password: ' + data.message);
      }
    } catch (error) {
      setMessage('Error changing password');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNotificationUpdate = async () => {
    if (!studentSession) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...notifications
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Notification settings updated successfully!');
      } else {
        setMessage('Error updating settings: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating notification settings');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePreferencesUpdate = async () => {
    if (!studentSession) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...preferences
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Preferences updated successfully!');
        applyTheme(preferences.theme);
      } else {
        setMessage('Error updating preferences: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating preferences');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'preferences', label: 'Preferences', icon: <FaPalette /> }
  ];

  return (
    <StudentLayout>
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {message && (
          <div className={`settings-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="settings-content">
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="settings-main">
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Notification Settings</h2>
                  <p>Choose what notifications you want to receive</p>
                </div>

                <div className="notification-settings">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Email Notifications</h3>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.email_notifications}
                        onChange={(e) => setNotifications({...notifications, email_notifications: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Push Notifications</h3>
                      <p>Receive push notifications in your browser</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push_notifications}
                        onChange={(e) => setNotifications({...notifications, push_notifications: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Assignment Reminders</h3>
                      <p>Get reminded about upcoming assignment deadlines</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.assignment_reminders}
                        onChange={(e) => setNotifications({...notifications, assignment_reminders: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Course Updates</h3>
                      <p>Notifications about new course content and updates</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.course_updates}
                        onChange={(e) => setNotifications({...notifications, course_updates: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Achievement Alerts</h3>
                      <p>Get notified when you earn badges and achievements</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.achievement_alerts}
                        onChange={(e) => setNotifications({...notifications, achievement_alerts: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <button 
                  className="save-btn"
                  onClick={handleNotificationUpdate}
                  disabled={loading}
                >
                  <FaSave />
                  {loading ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                  <p>Manage your password and security preferences</p>
                </div>

                <div className="security-section">
                  <h3>Change Password</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    className="save-btn"
                    onClick={handlePasswordChange}
                    disabled={loading}
                  >
                    <FaLock />
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>App Preferences</h2>
                  <p>Customize your app experience</p>
                </div>

                <div className="preferences-grid">
                  <div className="preference-item">
                    <label>Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value as 'light' | 'dark' | 'auto'})}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>Dashboard Layout</label>
                    <select
                      value={preferences.dashboard_layout}
                      onChange={(e) => setPreferences({...preferences, dashboard_layout: e.target.value as 'compact' | 'detailed'})}
                    >
                      <option value="detailed">Detailed</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="save-btn"
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                >
                  <FaSave />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Settings;