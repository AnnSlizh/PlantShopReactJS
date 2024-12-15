import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase-config';
import { setDoc, doc } from 'firebase/firestore';
import './SignUp.css'; 

const SignUp = ({ setUser, setError, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Добавляем информацию о пользователе в коллекцию users
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userId: user.uid,
        password: password,
        name: '',
        surname: '',
      });

      setUser(auth.currentUser);
      navigate('/catalog');
    } catch (err) {
      setError('Error during sign up');
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
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
