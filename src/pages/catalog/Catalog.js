import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import './Catalog.css';

const Catalog = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState(["All", "Popular", "Indoor", "Outdoor"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      const plantsCollection = collection(db, 'plants');
      const plantSnapshot = await getDocs(plantsCollection);
      const plantList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlants(plantList);
      setLoading(false);
    };

    const fetchCart = async () => {
      if (currentUser) {
        const cartCollection = query(collection(db, 'cart'), where('userId', '==', currentUser.uid));
        const cartSnapshot = await getDocs(cartCollection);
        const cartList = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCart(cartList.map(item => item.plantId));
      }
    };

    fetchPlants();
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePlantClick = (id) => {
    navigate(`/plant/${id}`);
  };

  const handleAddToCart = async (plant) => {
    if (currentUser) {
      if (cart.includes(plant.id)) {
        // Remove from cart
        const cartItem = await getDocs(query(collection(db, 'cart'), where('plantId', '==', plant.id), where('userId', '==', currentUser.uid)));
        if (!cartItem.empty) {
          try {
            await deleteDoc(doc(db, 'cart', cartItem.docs[0].id));
            setCart(cart.filter(id => id !== plant.id));
          } catch (error) {
            console.error('Error removing item from cart: ', error);
          }
        }
      } else {
        // Add to cart
        const cartId = uuidv4();
        try {
          await addDoc(collection(db, 'cart'), {
            plantId: plant.id,
            plantName: plant.name,
            plantPrice: plant.price,
            plantPhoto: plant.photo,
            userId: currentUser.uid,
          });
          setCart([...cart, plant.id]);
          console.log(`Added plant with id ${plant.id} to cart`);
        } catch (error) {
          console.error('Error adding item to cart: ', error);
        }
      }
    } else {
      // логика для неавторизованных пользователей (например, перенаправление на страницу входа)
      navigate('/login');
    }
  };

  const filteredPlants = selectedCategory === "All"
    ? plants
    : plants.filter(plant => plant.category === selectedCategory || (selectedCategory === "Popular" && plant.rating >= 7));

  return (
    <div>
      <NavBar />
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={category === selectedCategory ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={`catalog ${selectedCategory.toLowerCase()}`}>
        {loading ? (
          <p>Loading plants...</p>
        ) : filteredPlants.length === 0 ? (
          <p>No plants available.</p>
        ) : (
          filteredPlants.map((plant) => (
            <div key={plant.id} className="plant-card">
              <img src={plant.photo} alt={plant.name} className="plant-photo" onClick={() => handlePlantClick(plant.id)} />
              <p>{plant.name}</p>
              <h2>${plant.price}</h2>
              <button className="add-to-cart" onClick={() => handleAddToCart(plant)}>
                {cart.includes(plant.id) ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Catalog;
