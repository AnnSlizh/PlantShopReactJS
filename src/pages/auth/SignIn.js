// LogIn.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
import './SignIn.css'; // Подключаем SignIn.css

const SignIn = ({ setUser, setError, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      navigate('/catalog');
    } catch (err) {
      setError('Error: Invalid email or password');
    }
  };

  return (
    <div className="container">
      <h1>Welcome Back</h1>
      <p>Login to your account</p>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogIn}>Sign In</button>
    </div>
  );
};

export default SignIn;