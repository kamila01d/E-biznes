import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleAddToCart = (productId) => {
        let cartId = localStorage.getItem('cart_id');
        fetch('http://localhost:5000/carts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, cart_id: cartId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.cart_id) {
                    localStorage.setItem('cart_id', data.cart_id);
                }
                console.log('Added to cart:', data);
            })
            .catch(error => console.error('Error adding to cart:', error));
    };

    const goToCart = () => navigate('/cart');
    const clearCart = () => fetch(`http://localhost:5000/carts/${localStorage.getItem('cart_id')}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => response.ok && localStorage.removeItem('cart_id'));

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.ID}>
                        {product.name} - ${product.price.toFixed(2)}
                        <button onClick={() => handleAddToCart(product.ID)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
            <button onClick={goToCart}>Go to Cart</button>
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
}

export default Products;
