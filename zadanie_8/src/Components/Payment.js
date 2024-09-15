import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCartData, clearCartData } from '../utils/cartUtils';

function Payment() {
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const cartId = localStorage.getItem('cart_id');

    useEffect(() => {
        if (cartId) {
            fetchCartData(cartId)
                .then(({ total }) => setTotal(total))
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, [cartId]);

    const handlePayment = () => {
        const paymentData = { cart_id: parseInt(cartId, 10), amount: total, payment_method: paymentMethod };

        fetch('http://localhost:5000/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        })
            .then(response => response.json())
            .then(() => {
                clearCartData();
                navigate('/payment-success');
            })
            .catch(error => console.error('Error processing payment:', error));
    };

    return (
        <div>
            <h2>Payment</h2>
            <p>Total Amount: ${total.toFixed(2)}</p>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
            </select>
            <button onClick={handlePayment}>Submit Payment</button>
        </div>
    );
}

export default Payment;
