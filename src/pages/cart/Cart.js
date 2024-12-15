import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../../components/NavBar';
import './Cart.css';

const Cart = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const handleRemoveFromCart = async (id) => {
    try {
      await deleteDoc(doc(db, 'cart', id));
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart: ', error);
    }
  };

  const handlePlaceOrder = async () => {
    const purchaseId = uuidv4();
    const totalPrice = cartItems.reduce((acc, item) => acc + item.plantPrice, 0);
    const plantNames = cartItems.map(item => item.plantName);

    try {
      // Добавление данных о заказе в коллекцию 'purchases'
      await setDoc(doc(db, 'purchases', purchaseId), {
        id: purchaseId,
        totalPrice,
        date: new Date(),
        userId: currentUser.uid,
        plantNames,
      });

      // Очистка корзины
      console.log('Placing order and clearing cart...');
      for (const item of cartItems) {
        console.log(`Removing item with id: ${item.id}`);
        await deleteDoc(doc(db, 'cart', item.id));
      }

      setCartItems([]);
      setOrderPlaced(true);
      console.log('Cart cleared and order placed');
    } catch (error) {
      console.error('Error placing order: ', error);
    }
  };

  return (
    <div>
      <NavBar />
      {orderPlaced ? (
        <p>Thank you for your purchase!</p>
      ) : (
        cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
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
