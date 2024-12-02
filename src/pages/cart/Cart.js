import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore'; 
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid'; 
import NavBar from '../../components/NavBar'; // Импортируем компонент NavBar
import './Cart.css';

const Cart = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false); // Добавляем состояние для отслеживания заказа

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        const cartCollection = collection(db, 'cart');
        const q = query(cartCollection, where('userId', '==', currentUser.uid));
        const cartSnapshot = await getDocs(q);
        const cartList = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCartItems(cartList);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  const handleAddToCart = async (plant) => {
    const cartId = uuidv4(); // Генерация уникального идентификатора для корзины
    const cartItem = {
      id: cartId, // Уникальный ID для корзины
      plantId: plant.id,
      plantName: plant.name,
      plantPrice: plant.price,
      plantPhoto: plant.photo,
      userId: currentUser.uid,
    };

    try {
      await setDoc(doc(db, 'cart', cartId), cartItem); // Добавляем новый элемент в Firestore
      setCartItems(prevItems => [...prevItems, cartItem]); // Обновляем состояние корзины
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      console.log(`Attempting to remove item with id: ${id}`);  // Логирование перед удалением
      await deleteDoc(doc(db, 'cart', id));  // Удаление элемента из Firestore
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== id));  // Обновление состояния корзины
      console.log(`Removed item with id ${id} from cart`);  // Логирование успешного удаления
    } catch (error) {
      console.error('Error removing item from cart: ', error);  // Логирование ошибки
    }
  };

  const handlePlaceOrder = async () => {
    const purchaseId = uuidv4(); 
    const totalPrice = cartItems.reduce((acc, item) => acc + item.plantPrice, 0);
    const plantNames = cartItems.map(item => item.plantName);

    try {
      // Добавление данных о заказе в коллекцию 'purchases'
      await addDoc(collection(db, 'purchases'), {
        id: purchaseId,
        totalPrice,
        date: new Date(),
        userId: currentUser.uid,
        plantNames,
      });

      // Очистка корзины
      console.log('Placing order and clearing cart...');
      for (const item of cartItems) {
        console.log(`Removing item with id: ${item.id}`);  // Логирование перед удалением
        await deleteDoc(doc(db, 'cart', item.id));  // Удаление каждого элемента корзины из Firestore
      }

      setCartItems([]);  // Очистка состояния корзины
      setOrderPlaced(true);  // Устанавливаем состояние, что заказ был размещен
      console.log('Cart cleared and order placed');
    } catch (error) {
      console.error('Error placing order: ', error);  // Логирование ошибок
    }
  };

  return (
    <div>
      <NavBar /> {/* Добавляем NavBar на страницу */}
      {orderPlaced ? (
        <p>Thank you for your purchase!</p>
      ) : (
        cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {/* Контейнер для элементов корзины с вертикальной прокруткой */}
            <div className="cart-items-container">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.plantPhoto} alt={item.plantName} />
                  <div className="details">
                    <h3>{item.plantName}</h3>
                    <p>${item.plantPrice}</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Total: ${cartItems.reduce((acc, item) => acc + item.plantPrice, 0)}</h3>
              <button onClick={handlePlaceOrder}>Place order</button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Cart;
