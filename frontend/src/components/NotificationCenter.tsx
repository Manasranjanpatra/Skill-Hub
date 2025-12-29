import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo, FaBullhorn, FaEnvelope, FaTrophy } from 'react-icons/fa';
import './NotificationCenter.css';

interface Notification {
  id: number;
  type: 'assessment' | 'course_update' | 'badge' | 'message';
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationCenterProps {
  userId: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    // Use mock data directly (skip API calls)
    const mockNotifications = [
      {
        id: 1,
        type: 'assessment' as const,
        title: 'Assignment Due Soon',
        message: 'Your Web Development assignment is due in 2 days',
        status: 'unread' as const,
        created_at: '2025-01-15T10:30:00Z',
        priority: 'high' as const
      },
      {
        id: 2,
        type: 'message' as const,
        title: '📢 Welcome to AIEduPro!',
        message: 'Welcome to our AI-powered learning platform! Start exploring courses, track your progress, and achieve your learning goals.',
        status: 'unread' as const,
        created_at: '2025-01-15T09:00:00Z',
        priority: 'high' as const
      },
      {
        id: 3,
        type: 'message' as const,
        title: '🚀 New Features Available',
        message: 'Check out our new dashboard features including AI-powered recommendations, progress analytics, and interactive learning modules.',
        status: 'unread' as const,
        created_at: '2025-01-15T08:30:00Z',
        priority: 'medium' as const
      },
      {
        id: 4,
        type: 'badge' as const,
        title: 'Badge Earned!',
        message: 'Congratulations! You earned the "Fast Learner" badge for completing your first course.',
        status: 'unread' as const,
        created_at: '2025-01-15T08:15:00Z',
        priority: 'medium' as const
      },
      {
        id: 5,
        type: 'message' as const,
        title: '📚 New Course: Advanced React Development',
        message: 'We are excited to announce a new advanced React course starting next week. Learn hooks, context, performance optimization, and more!',
        status: 'unread' as const,
        created_at: '2025-01-15T08:00:00Z',
        priority: 'high' as const
      },
      {
        id: 6,
        type: 'message' as const,
        title: '⚠️ System Maintenance Scheduled',
        message: 'The learning platform will undergo maintenance on Sunday from 2 AM to 4 AM. Please save your work before this time.',
        status: 'read' as const,
        created_at: '2025-01-14T15:30:00Z',
        priority: 'medium' as const
      },
      {
        id: 7,
        type: 'message' as const,
        title: '🎯 Weekly Learning Goals',
        message: 'Set your weekly learning goals and track your progress. Consistent learning leads to better outcomes!',
        status: 'read' as const,
        created_at: '2025-01-14T12:00:00Z',
        priority: 'low' as const
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => n.status === 'unread').length);
  };

  const markAsRead = (notificationId: number | string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: string, title: string) => {
    // Check if it's an announcement based on title or type
    if (title.toLowerCase().includes('announcement') || 
        title.toLowerCase().includes('new course') || 
        title.toLowerCase().includes('maintenance') ||
        title.toLowerCase().includes('welcome') ||
        title.toLowerCase().includes('features')) {
      return <FaBullhorn style={{ color: '#8b5cf6' }} />;
    }
    
    switch (type) {
      case 'assessment': return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      case 'badge': return <FaTrophy style={{ color: '#f59e0b' }} />;
      case 'course_update': return <FaInfo style={{ color: '#3b82f6' }} />;
      case 'message': return <FaEnvelope style={{ color: '#6b7280' }} />;
      default: return <FaInfo style={{ color: '#6b7280' }} />;
    }
  };

  const getNotificationLabel = (type: string, title: string) => {
    if (title.toLowerCase().includes('announcement') || 
        title.toLowerCase().includes('new course') || 
        title.toLowerCase().includes('maintenance') ||
        title.toLowerCase().includes('welcome') ||
        title.toLowerCase().includes('features')) {
      return 'Announcement';
    }
    
    switch (type) {
      case 'assessment': return 'Assignment';
      case 'badge': return 'Achievement';
      case 'course_update': return 'Course Update';
      case 'message': return 'Message';
      default: return 'Notification';
    }
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.status}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type, notification.title)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-type-label">
                        {getNotificationLabel(notification.type, notification.title)}
                      </span>
                    </div>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {notification.status === 'unread' && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
