import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://pagapouco.onrender.com/api/products/public/');
                setProducts(response.data);
            } catch (err) {
                setError('Erro ao buscar produtos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // O array vazio garante que o efeito só seja chamado uma vez após a montagem

    return (
        <ProductContext.Provider value={{ products, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};
