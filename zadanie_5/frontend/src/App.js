import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './Components/Products';
import Cart from './Components/Cart';
import Payment from './Components/Payment';
import PaymentSuccess from "./Components/PaymentSuccess";

function App() {
    const [cartItems, setCartItems] = useState([]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Products addToCart={setCartItems} />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} />} />
                <Route path="/payment" element={<Payment cartItems={cartItems}/>} />
                <Route path="/payment-success" element={<PaymentSuccess/>} />
            </Routes>
        </Router>
    );
}

export default App;
