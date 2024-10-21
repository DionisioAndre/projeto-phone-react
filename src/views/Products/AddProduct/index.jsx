import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/authContext';
import Loading from '../../../components/Loading';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        tipo: '',
        description: '',
        price: '',
        image: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? Math.max(0, parseFloat(value)) || '' : value
        }));
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            setError('Por favor, selecione um arquivo de imagem.');
            return;
        }
        setFormData(prevData => ({ ...prevData, image: file }));
        setError('');
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Usuário não autenticado.');
            return;
        }

        const sellerId = Number(user.id);
        if (isNaN(sellerId)) {
            setError('ID do vendedor inválido.');
            return;
        }

        const priceValue = parseFloat(formData.price);
        if (isNaN(priceValue) || priceValue < 0) {
            setError('Por favor, insira um preço válido.');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('tipo', formData.tipo);
        data.append('description', formData.description);
        data.append('price', priceValue); // Usando priceValue que é um número
        data.append('seller', sellerId);
        if (formData.image) data.append('image', formData.image);

        setLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/routerproducts/', data, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setSuccess('Produto adicionado com sucesso!');
            setFormData({ name: '', tipo: '', description: '', price: '', image: null });
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao adicionar produto.';
            setError(errorMessage);
            console.log(err.response.data);
        } finally {
            setLoading(false);
        }
    }, [formData, user]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h2>Adicionar Novo Produto</h2>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <form onSubmit={handleSubmit}>
                {['name', 'tipo', 'description', 'price'].map((field, index) => (
                    <div className="form-group" key={index}>
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {field === 'description' ? (
                            <textarea
                                id={field}
                                name={field}
                                className="form-control"
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <input
                                type={field === 'price' ? 'number' : 'text'}
                                id={field}
                                name={field}
                                className="form-control"
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                min={field === 'price' ? '0' : undefined}
                            />
                        )}
                    </div>
                ))}
                <div className="form-group">
                    <label htmlFor="image">Imagem</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adicionando...' : 'Adicionar Produto'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
