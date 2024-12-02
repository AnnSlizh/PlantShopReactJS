// src/pages/profile/Profile.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import NavBar from '../../components/NavBar';
import './Profile.css';
import profileImage from '../../res/profile.png'; // Импортируем изображение

const Profile = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (currentUser) {
        const q = query(collection(db, 'purchases'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userPurchases = [];
        querySnapshot.forEach((doc) => {
          userPurchases.push({ id: doc.id, ...doc.data() });
        });
        setPurchases(userPurchases);
      }
    };

    fetchPurchases();
  }, [currentUser]);

  return (
    <div>
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <img src={profileImage} alt="Profile" />
          <div className="profile-info">
            <p>Email:</p>
            <p>{currentUser ? currentUser.email : 'Loading...'}</p>
          </div>
        </div>
        {purchases.length > 0 ? (
          <div className="purchases">
            <h2>My purchases</h2>
            <div className="purchases-container">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="purchase-item">
                  <div className="purchase-details">
                    <div className="purchase-date">
                      {new Date(purchase.date.seconds * 1000).toLocaleDateString()}
                    </div>
                    <div className="plant-names">
                      {purchase.plantNames.join(', ')}
                    </div>
                  </div>
                  <span className="purchase-price">${purchase.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-purchases">
            <h2>No purchases yet</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
