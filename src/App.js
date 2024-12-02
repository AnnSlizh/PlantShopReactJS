// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import NavBar from './components/NavBar';
import Profile from './pages/profile/Profile';
import './App.css';

const App = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/catalog'); // Перенаправляем на каталог при успешной авторизации
    }
  }, [currentUser, navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin); // Переключаем между входом и регистрацией
    setError(''); // Сбрасываем ошибку при переключении
  };

  return (
    <div className="auth-wrapper">
      {currentUser && <NavBar />} {/* Отображаем NavBar, если пользователь авторизован */}

      <Routes>
        <Route path="/profile" element={<Profile />} />
        {/* остальные маршруты */}
      </Routes>

      {isLogin ? (
        <SignIn setError={setError} />
      ) : (
        <SignUp setError={setError} />
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <p style={{ textAlign: 'center' }}>
        {isLogin ? (
          <>
            Don't have an account? <a onClick={toggleAuthMode}>Sign Up</a>
          </>
        ) : (
          <>
            Already have an account? <a onClick={toggleAuthMode}>Sign In</a>
          </>
        )}
      </p>
    </div>
  );
};

export default App;
