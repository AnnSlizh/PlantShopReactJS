import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { FaStar } from 'react-icons/fa'; // Импортируем иконку звездочки
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import './PlantDetail.css';

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlant = async () => {
      const plantDoc = doc(db, 'plants', id);
      const plantSnapshot = await getDoc(plantDoc);
      if (plantSnapshot.exists()) {
        setPlant(plantSnapshot.data());
      }
    };

    fetchPlant(); // Загружаем информацию о растении
  }, [id]);

  const handleAddToCart = async () => {
    if (currentUser) {
      // Генерируем уникальный id для элемента корзины
      const cartId = uuidv4(); // Генерация уникального cartId
      // Добавить в корзину с использованием cartId как имени документа
      await setDoc(doc(db, 'cart', cartId), {
        id: cartId, // Используем сгенерированный cartId как ID документа
        plantId: parseInt(id, 10), // Преобразуем plantId в int
        plantName: plant.name,
        plantPrice: plant.price,
        plantPhoto: plant.photo,
        userId: currentUser.uid,
      });
      alert('Plant added to cart');
    } else {
      // Если пользователь не авторизован, показываем сообщение
      alert('Please log in to add to cart.');
    }
  };

  if (!plant) {
    return <p>Loading plant details...</p>;
  }

  return (
    <div>
      <NavBar />
      <div className="plant-detail-container">
        <img src={plant.photo} alt={plant.name} className="plant-photo-detail" />
        <div className="plant-detail">
          <div className="plant-header">
            <h1>{plant.name}</h1>
            <div className="plant-rating">
              <FaStar color="yellow" />
              <span>{plant.rating}</span>
            </div>
          </div>
          <h1>Price: ${plant.price}</h1>
          <p>Category: {plant.category}</p>
          <p>Size: {plant.size}</p>
          <p>Humidity: {plant.humidity}%</p>
          <p>{plant.description}</p>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
