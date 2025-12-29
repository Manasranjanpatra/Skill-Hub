import { useState } from 'react';

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div>
            <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/eduiyata logo.png" alt="Eduyata Logo" style={{ height: '40px', width: 'auto', display: 'block' }} />
            </a>
          </div>
          
          <nav className="nav">
            <a href="#" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                Modules <i className="fas fa-chevron-down"></i>
              </button>
              <div 
                className="dropdown-menu"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a href="#" className="dropdown-item">AI Buddy</a>
                <a href="#" className="dropdown-item">Gamification</a>
                <a href="#" className="dropdown-item">AR Science Lab</a>
              </div>
            </div>
            <a href="#" className="nav-link">Courses</a>
            {/* Removed Log in from nav */}
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-login"
              style={{ background: '#fff', color: '#6C63FF', border: '2px solid #6C63FF', fontWeight: 600 }}
              onClick={onLoginClick}
            >
              Log in
            </button>
            <button className="btn btn-primary">
              Join for Free
            </button>
            <button className="mobile-menu-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
