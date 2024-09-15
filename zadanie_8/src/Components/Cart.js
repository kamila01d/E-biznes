import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCartData, clearCartData } from '../utils/cartUtils';

function Cart() {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const cartId = localStorage.getItem('cart_id');
        if (cartId) {
            fetchCartData(cartId)
                .then(({ cart, total }) => {
                    setCart(cart);
                    setTotal(total);
                })
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, []);

    const clearCart = () => {
        clearCartData()
            .then(() => window.location.reload())
            .catch(error => console.error('Error clearing cart:', error));
    };

    const goToPayment = () => navigate('/payment');

    if (!cart) return <p>No items in the cart.</p>;

    return (
        <div>
            <h2>Your Cart</h2>
            <ul>
                {cart.Products.map(item => (
                    <li key={item.id}>
                        {item.name} - ${item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={goToPayment}>Go to Payment</button>
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
}

export default Cart;
