// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  // Стили для Header

const Header = () => {
  return (
    <div className="header">
      <h1>PlantShop</h1>
      <div className="nav-links">
        <Link to="/catalog">Catalog</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </div>
  );
};

export default Header;
