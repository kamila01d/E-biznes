import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
    const navigate = useNavigate();
    const returnToHome = () => navigate("/");

    return (
        <div>
            <h2>Payment Successful!</h2>
            <p>Your payment has been processed successfully.</p>
            <button onClick={returnToHome}>Go to Home</button>
        </div>
    );
}

export default PaymentSuccess;
