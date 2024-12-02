// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import Catalog from './pages/catalog/Catalog';
import PlantDetail from './pages/details/PlantDetail';
import Cart from './pages/cart/Cart';
import Profile from './pages/profile/Profile'; // Импортируем страницу профиля
import './index.css';

const Root = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} /> {/* Добавляем маршрут для профиля */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
