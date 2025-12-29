import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaGraduationCap, FaChartLine,
  FaSignOutAlt, FaBell, FaCog, FaShieldAlt, FaArrowRight, FaPlus,
  FaCheckCircle, FaExclamationTriangle, FaEye, FaCalendarAlt,
  FaFileAlt, FaUserGraduate, FaUserTie, FaClipboardList, FaAward, FaStar,
  FaDollarSign, FaEnvelope, FaDatabase, FaChartBar, FaPlayCircle, FaTrophy,
  FaRocket, FaLightbulb, FaCrosshairs, FaFire, FaMedal, FaBookOpen
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [dashboardStats, setDashboardStats] = useState({
    total_students: 0,
    active_teachers: 0,
    total_courses: 0,
    monthly_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/admin-login');
      return;
    }
    setAdminData({ name: session.name, email: session.email || '' });
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/dashboard-stats/');
      const result = await response.json();
      
      if (response.ok) {
        setDashboardStats(result.stats);
      } else {
        console.error('Failed to fetch dashboard stats:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Students', 
      value: '2,847', 
      change: '+12%', 
      icon: FaUsers, 
      color: 'primary',
      trend: 'up'
    },
    { 
      title: 'Active Teachers', 
      value: '156', 
      change: '+5%', 
      icon: FaChalkboardTeacher, 
      color: 'success',
      trend: 'up'
    },
    { 
      title: 'Total Courses', 
      value: '89', 
      change: '+8%', 
      icon: FaBook, 
      color: 'info',
      trend: 'up'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$24,580', 
      change: '+15%', 
      icon: FaDollarSign, 
      color: 'warning',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New student registered', subject: 'Kallesh', course: '', time: '2 minutes ago', type: 'enrolled', icon: FaUserGraduate },
    { id: 2, action: 'Course updated', subject: 'Advanced Physics', course: 'Physics', time: '15 minutes ago', type: 'completed', icon: FaBook },
    { id: 3, action: 'Assignment submitted', subject: 'Calculus Quiz', course: 'Mathematics', time: '1 hour ago', type: 'submitted', icon: FaClipboardList },
    { id: 4, action: 'New teacher approved', subject: 'Dr. Narasimha', course: '', time: '2 hours ago', type: 'achievement', icon: FaUserTie },
    { id: 5, action: 'System backup completed', subject: 'Database Backup', course: '', time: '3 hours ago', type: 'started', icon: FaCog }
  ];

  const pendingApprovals = [
    { id: 1, type: 'Teacher Application', name: 'Dr. Thimmaiah', subject: 'Mathematics', status: 'pending' },
    { id: 2, type: 'Course Proposal', name: 'Advanced Physics', teacher: 'Prof. Jagadeesh', status: 'review' },
    { id: 3, type: 'Student Appeal', name: 'Grade Review Request', student: 'Mallikarjun', status: 'urgent' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server storage at 85% capacity', time: '1 hour ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance tonight at 2 AM', time: '3 hours ago' },
    { id: 3, type: 'success', message: 'Database backup completed successfully', time: '6 hours ago' }
  ];

  const quickActions = [
    { title: 'Add Student', description: 'Register new student account', icon: FaUserGraduate, color: 'primary' },
    { title: 'Add Teacher', description: 'Create teacher profile', icon: FaChalkboardTeacher, color: 'success' },
    { title: 'New Course', description: 'Add course to catalog', icon: FaBook, color: 'info' },
    { title: 'Generate Report', description: 'Create system report', icon: FaFileAlt, color: 'warning' }
  ];



  const managementCards = [
    {
      title: 'User Management',
      icon: FaUsers,
      stats: [
        { number: loading ? '...' : dashboardStats.total_students.toLocaleString(), label: 'Students' },
        { number: loading ? '...' : dashboardStats.active_teachers.toString(), label: 'Teachers' },
        { number: '12', label: 'Admins' }
      ],
      action: 'Manage Users'
    },
    {
      title: 'Course Management',
      icon: FaBook,
      stats: [
        { number: loading ? '...' : dashboardStats.total_courses.toString(), label: 'Active Courses' },
        { number: '23', label: 'Categories' },
        { number: '1,245', label: 'Enrollments' }
      ],
      action: 'Manage Courses'
    },
    {
      title: 'Financial Management',
      icon: FaDollarSign,
      stats: [
        { number: loading ? '...' : `$${dashboardStats.monthly_revenue.toLocaleString()}`, label: 'Monthly Revenue' },
        { number: '1,892', label: 'Transactions' },
        { number: '94%', label: 'Payment Success' }
      ],
      action: 'View Financial Reports'
    },
    {
      title: 'Analytics & Reports',
      icon: FaChartLine,
      stats: [
        { number: '85%', label: 'Completion Rate' },
        { number: '4.8', label: 'Avg Rating' },
        { number: '92%', label: 'Satisfaction' }
      ],
      action: 'View Analytics'
    }
  ];

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome back, <span className="hero-name">{adminData.name}</span>! 👋</h1>
                <p className="hero-subtitle one-line">Here's what's happening with your platform today. Manage users, courses, and monitor system performance.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card primary">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.total_students.toLocaleString()}</h3>
                <p>Total Students</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #9333ea)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.active_teachers}</h3>
                <p>Active Teachers</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.total_courses}</h3>
                <p>Total Courses</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : `$${dashboardStats.monthly_revenue.toLocaleString()}`}</h3>
                <p>Monthly Revenue</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Main Dashboard Grid */}
          <div className="learning-goals-row">
            {/* Pending Approvals */}
            <div className="dashboard-section continue-learning">
              <div className="section-header">
                <div className="section-title">
                  <FaCheckCircle className="section-icon" />
                  <h2>Pending Approvals</h2>
                </div>
                <button className="view-all-btn">
                  View All
                  <FaArrowRight />
                </button>
              </div>
              <div className="approvals-list">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="approval-item">
                    <div className="approval-content">
                      <div className="approval-type">{approval.type}</div>
                      <div className="approval-name">{approval.name}</div>
                      {approval.subject && <div className="approval-subject">{approval.subject}</div>}
                      {approval.teacher && <div className="approval-teacher">by {approval.teacher}</div>}
                      {approval.student && <div className="approval-student">by {approval.student}</div>}
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn">Approve</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="goals-section">
              <div className="section-header">
                <div className="section-title">
                  <FaExclamationTriangle className="section-icon" />
                  <h2>System Alerts</h2>
                </div>
              </div>
              <div className="alerts-list">
                {systemAlerts.map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'warning' && <FaExclamationTriangle />}
                      {alert.type === 'info' && <FaBell />}
                      {alert.type === 'success' && <FaCheckCircle />}
                    </div>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Dashboard - Admin Analytics */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Platform Analytics Overview</h2>
              </div>
              <button className="view-all-btn">
                Detailed Analytics
                <FaArrowRight />
              </button>
            </div>
            
            {/* Progress Metrics Row */}
            <div className="progress-metrics-row">
              <div className="progress-metric">
                <div className="metric-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">92%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>Platform Uptime</h4>
                  <p className="metric-trend positive">+2% this month</p>
                </div>
              </div>
              
              <div className="progress-metric">
                <div className="metric-circle orange">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle orange" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">78%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>User Engagement</h4>
                  <p className="metric-trend positive">+5% this week</p>
                </div>
              </div>
              
              <div className="streak-card">
                <div className="streak-flame">🚀</div>
                <div className="streak-info">
                  <h4>15 Days Growth</h4>
                  <p>Consistent growth!</p>
                </div>
              </div>
            </div>
            
            {/* Overall Performance Summary */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaTrophy />
                  </div>
                  <div className="summary-content">
                    <h3>Platform Performance Excellent</h3>
                    <p>Your platform is performing exceptionally well across all metrics!</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">{loading ? '...' : `${(dashboardStats.total_students / 1000).toFixed(1)}K`}</span>
                        <span className="stat-label">Active Users</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{loading ? '...' : dashboardStats.total_courses}</span>
                        <span className="stat-label">Courses Live</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{loading ? '...' : `$${(dashboardStats.monthly_revenue / 1000).toFixed(0)}K`}</span>
                        <span className="stat-label">Monthly Revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View Complete Dashboard
                  <FaArrowRight />
                </button>
              </div>
              
              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Revenue Growth</h4>
                  <p>Monthly revenue increased by 15% with 1,892 successful transactions</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">👥</div>
                  <h4>User Acquisition</h4>
                  <p>156 new students registered this week, 12% increase from last week</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <h4>Course Completion</h4>
                  <p>85% average completion rate across all courses, exceeding target</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid - Recent Activity */}
          <div className="bottom-grid">
            <div className="activity-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChartBar className="section-icon" />
                  <h2>Recent Platform Activity</h2>
                </div>
              </div>
              
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'completed' && <FaCheckCircle />}
                      {activity.type === 'submitted' && <FaClipboardList />}
                      {activity.type === 'started' && <FaPlayCircle />}
                      {activity.type === 'achievement' && <FaMedal />}
                      {activity.type === 'enrolled' && <FaBook />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <span className="activity-action">{activity.action}:</span> {activity.subject}
                      </div>
                      {activity.course && <div className="activity-course">{activity.course}</div>}
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reminders-section">
              <div className="dashboard-section">
                <div className="section-header">
                  <div className="section-title">
                    <FaBell className="section-icon" />
                    <h2>Admin Notifications</h2>
                  </div>
                </div>
                <div className="admin-notifications">
                  <div className="notification-item urgent">
                    <FaExclamationTriangle className="notification-icon" />
                    <div className="notification-content">
                      <h4>Server Maintenance Required</h4>
                      <p>Schedule maintenance for optimal performance</p>
                      <span className="notification-time">Due: Tonight</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaUsers className="notification-icon" />
                    <div className="notification-content">
                      <h4>3 Teacher Applications</h4>
                      <p>Review and approve pending applications</p>
                      <span className="notification-time">2 days ago</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaChartLine className="notification-icon" />
                    <div className="notification-content">
                      <h4>Monthly Report Ready</h4>
                      <p>Platform analytics report is available</p>
                      <span className="notification-time">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div className="recommended-grid">
            {managementCards.map((card, index) => (
              <div key={index} className="management-card">
                <div className="management-header">
                  <card.icon className="management-icon" />
                  <h3>{card.title}</h3>
                </div>
                <div className="management-stats">
                  {card.stats.map((stat, idx) => (
                    <div key={idx} className="management-stat">
                      <span className="stat-number">{stat.number}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <button className="management-btn">{card.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
