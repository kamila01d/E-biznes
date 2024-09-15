// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './Components/Products';
import Cart from './Components/Cart';
import Payment from './Components/Payment';
import PaymentSuccess from './Components/PaymentSuccess';
import Login from './Components/Login';

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Products addToCart={setCartItems} />} />
                        <Route path="/cart" element={<Cart cartItems={cartItems} />} />
                        <Route path="/cart/payment" element={<Payment cartItems={cartItems} />} />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;
