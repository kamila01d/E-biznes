import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const backendRedirectUrl = "redirectURL";

    const getTokenFromBackend = async () => {
        try {
            const response = await fetch(`${backendRedirectUrl}/login`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }

            const { access_token: accessToken } = await response.json();
            localStorage.setItem('access_token', accessToken);
            console.log('Token stored:', accessToken);
            navigate('/products');
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleLoginClick = async () => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            await getTokenFromBackend();
        } else {

            navigate('/products');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <p>Click the button to log in via Google.</p>
            <button onClick={handleLoginClick}>Log In</button>
        </div>
    );
};

export default Login;
