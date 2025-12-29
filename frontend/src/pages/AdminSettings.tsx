import React from 'react';
import { FaCog, FaUserShield, FaBell, FaPalette, FaLock, FaArrowRight, FaGlobe, FaDatabase } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminSettings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">System Settings</h1>
                <p className="hero-subtitle">Configure platform settings, security options, and system preferences</p>
              </div>
            </div>
          </div>

          {/* Settings Overview Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaCog />
              </div>
              <div className="stat-content">
                <h3>47</h3>
                <p>Active Settings</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaUserShield />
              </div>
              <div className="stat-content">
                <h3>High</h3>
                <p>Security Level</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaBell />
              </div>
              <div className="stat-content">
                <h3>12</h3>
                <p>Active Notifications</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaGlobe />
              </div>
              <div className="stat-content">
                <h3>Multi</h3>
                <p>Language Support</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Management Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaCog className="section-icon" />
                <h2>Configuration Overview</h2>
              </div>
              <button className="view-all-btn">
                Save All Changes
                <FaArrowRight />
              </button>
            </div>

            {/* Settings Categories */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaUserShield />
                  </div>
                  <div className="summary-content">
                    <h3>Security & Access Control</h3>
                    <p>Manage authentication, permissions, and security policies</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">2FA</span>
                        <span className="stat-label">Enabled</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">AES-256</span>
                        <span className="stat-label">Encryption</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">Auto</span>
                        <span className="stat-label">Session Timeout</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  Security Settings
                  <FaArrowRight />
                </button>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">🔐</div>
                  <h4>Authentication</h4>
                  <p>Multi-factor authentication and password policies configured</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">👥</div>
                  <h4>User Permissions</h4>
                  <p>Role-based access control with granular permissions</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📊</div>
                  <h4>Audit Logging</h4>
                  <p>Comprehensive logging of all administrative actions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Management Cards */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaPalette className="management-icon" />
                <h3>Appearance</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Light</span>
                  <span className="stat-label">Theme</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">English</span>
                  <span className="stat-label">Language</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Responsive</span>
                  <span className="stat-label">Layout</span>
                </div>
              </div>
              <button className="management-btn">Customize Interface</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaBell className="management-icon" />
                <h3>Notifications</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Active Rules</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Email</span>
                  <span className="stat-label">Primary</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Instant</span>
                  <span className="stat-label">Delivery</span>
                </div>
              </div>
              <button className="management-btn">Notification Settings</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaDatabase className="management-icon" />
                <h3>Database</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">MySQL</span>
                  <span className="stat-label">Engine</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Optimized</span>
                  <span className="stat-label">Performance</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Auto</span>
                  <span className="stat-label">Backup</span>
                </div>
              </div>
              <button className="management-btn">Database Settings</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaLock className="management-icon" />
                <h3>Privacy</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">GDPR</span>
                  <span className="stat-label">Compliant</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Encrypted</span>
                  <span className="stat-label">Data</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">30 Days</span>
                  <span className="stat-label">Retention</span>
                </div>
              </div>
              <button className="management-btn">Privacy Settings</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;