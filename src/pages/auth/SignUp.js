// SignIn.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
import './SignUp.css'; // Подключаем SignUp.css

const SignUp = ({ setUser, setError, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      navigate('/catalog');
    } catch (err) {
      setError('Error during sign up');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <p>Create your new account</p>
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
      <button onClick={handleSignUp}>Sign Up</button>

    </div>
  );
};

export default SignUp;