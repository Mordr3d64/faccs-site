import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../logo.png';

function NavPanel() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="NavPanel">
      <div className="nav-brand">
        <img src={logo} className="App-logo" alt="FACCS Logo" />
        <span>FACCS</span>
      </div>
      <ul className="nav-links">
        <li><Link className="NavLink" to="/">Home</Link></li>
        <li><Link className="NavLink" to="/announcements">Announcements</Link></li>
        <li><Link className="NavLink" to="/contact">Contact</Link></li>
        <li><Link className="NavLink" to="/weather">Weather</Link></li>
        <li><Link className="NavLink" to="/faqs">FAQs</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link className="NavLink" to="/admin">Admin</Link></li>
            <li><button onClick={handleLogout} className="NavLink logout-button">Logout</button></li>
          </>
        ) : (
          <li><Link className="NavLink" to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavPanel; 