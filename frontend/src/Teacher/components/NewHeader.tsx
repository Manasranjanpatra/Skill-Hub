"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import "./NewHeader.css";
import { Search, Bell, Settings, User, LogOut, Moon, Sun, HelpCircle } from "lucide-react";


interface NewHeaderProps {
  avatar?: string;
  name: string;
  role: string;
  gender?: string;
  studentId?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

// Function to get avatar based on gender
export const getAvatarUrl = (gender?: string, customAvatar?: string) => {
  if (customAvatar) return customAvatar;
  
  const maleAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const femaleAvatar = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png';
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
  
  if (!gender) return defaultAvatar;
  if (gender.toLowerCase() === 'male') return maleAvatar;
  if (gender.toLowerCase() === 'female') return femaleAvatar;
  return defaultAvatar;
};

export const NewHeader: React.FC<NewHeaderProps> = ({
  avatar,
  name,
  role,
  gender,
  studentId,
  searchPlaceholder = "Search for courses, assignments...",
  onSearch,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (studentId) {
          console.log('Fetching notifications for student:', studentId);
          const response = await fetch(`http://localhost:8001/api/courses/notifications/?student_id=${studentId}`);
          const data = await response.json();
          console.log('Notifications response:', data);
          if (data.status === 'success') {
            console.log('Setting notifications:', data.data);
            // Only keep unread notifications to avoid showing old read ones
            setNotifications((data.data || []).filter((n: any) => n.unread));
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    

    
    if (studentId) {
      fetchNotifications();
    }
  }, [studentId]);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (notification.unread && studentId) {
      try {
        await fetch('http://localhost:8001/api/courses/mark_notification_read/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notification_id: notification.id,
            student_id: studentId
          })
        });
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, unread: false } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Navigate based on notification content
    if (notification.message.includes('profile')) {
      navigate('/profile-completion');
    } else if (notification.message.includes('enrolled')) {
      navigate('/courses');
    } else if (notification.message.includes('assignment')) {
      navigate('/assignments');
    } else if (notification.message.includes('grade')) {
      navigate('/performance');
    }
    
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    if (!studentId) return;
    
    try {
      await fetch('http://localhost:8001/api/courses/mark_all_notifications_read/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, unread: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
  };

  return (
    <header className="new-header">
      <div className="header-container">
        {/* Logo/Brand Section */}
        <div className="header-brand">
          <div className="brand-logo">
            <img src="/images/eduiyata logo.png" alt="Eduyata Logo" className="logo-image" />
          </div>
        </div>

        {/* Search Section */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="header-actions">
          {/* Dark Mode Toggle */}
          <button 
            className="header-action-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Help Button */}
          <button className="header-action-btn" title="Help">
            <HelpCircle size={20} />
          </button>

          {/* Settings Button */}
          <button className="header-action-btn" title="Settings">
            <Settings size={20} />
          </button>

          {/* Notifications */}
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button 
              className="header-action-btn notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={20} />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read" onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {notification.unread && <div className="unread-indicator" />}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile-wrapper">
            <button 
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img 
                src={getAvatarUrl(gender, avatar)} 
                alt={name} 
                className="user-avatar" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getAvatarUrl(gender);
                }}
              />
              <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-role">{role}</span>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <img 
                    src={getAvatarUrl(gender, avatar)} 
                    alt={name} 
                    className="menu-avatar" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getAvatarUrl(gender);
                    }}
                  />
                  <div className="menu-user-info">
                    <span className="menu-user-name">{name}</span>
                    <span className="menu-user-role">{role}</span>
                  </div>
                </div>
                <div className="user-menu-items">
                  <button 
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/student-info');
                    }}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="menu-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="menu-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader; 
