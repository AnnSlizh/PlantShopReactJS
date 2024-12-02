// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDLUkoIRSulqHE8EeZv4Bb5wk7-wquLVSw",
    authDomain: "plantshop-45e83.firebaseapp.com",
    projectId: "plantshop-45e83",
    storageBucket: "plantshop-45e83.firebasestorage.app",
    messagingSenderId: "469103920001",
    appId: "1:469103920001:web:ae17f0b3fdca08c6e41e80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db  };
