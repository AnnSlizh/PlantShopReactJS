// src/components/NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1>PlantShop</h1>
      </div>
      <div className="nav-right">
        <Link to="/catalog">Catalog</Link>
        <Link to="/cart">Cart</Link>
        {currentUser ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
