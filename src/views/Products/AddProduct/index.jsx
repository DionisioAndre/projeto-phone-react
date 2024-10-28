import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/authContext';
import { useNavigate } from "react-router-dom";
import Loading from '../../../components/Loading';
import { logoutUser } from '../../../services/localStorege';
import { Button, Form, Container } from 'react-bootstrap';
import './AddProduct.css';

// Função de sanitização simples
const sanitizeInput = (input) => {
    return input.replace(/<script.*?>.*?<\/script>/gi, '').trim(); // Remove scripts
};

const AddProduct = () => {
    const navigate = useNavigate();
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
            [name]: name === 'price' ? Math.max(0, parseFloat(value)) || '' : sanitizeInput(value)
        }));
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('Por favor, selecione um arquivo de imagem.');
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            setError('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, GIF).');
            setFormData(prevData => ({ ...prevData, image: null }));
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
        data.append('name', sanitizeInput(formData.name));
        data.append('tipo', sanitizeInput(formData.tipo));
        data.append('description', sanitizeInput(formData.description));
        data.append('price', priceValue);
        data.append('seller', sellerId);

        if (formData.image) {
            data.append('image', formData.image);
        } else {
            setError('Por favor, selecione uma imagem válida antes de enviar.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/api/routerproducts/', data, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setSuccess('Produto adicionado com sucesso!');
            setFormData({ name: '', tipo: '', description: '', price: '', image: null });
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao adicionar produto.';
            setError('Erro ao adicionar produto.');
            if (err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [formData, user]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="custom-background">
            <Container className="mt-5">
                <h2>Adicionar Novo Produto</h2>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <Form onSubmit={handleSubmit}>
                    {['name', 'description', 'price'].map((field, index) => (
                        <Form.Group className="mb-3" key={index}>
                            <Form.Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            {field === 'description' ? (
                                <Form.Control
                                    as="textarea"
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            ) : (
                                <Form.Control
                                    type={field === 'price' ? 'number' : 'text'}
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    min={field === 'price' ? '0' : undefined}
                                    aria-required="true"
                                />
                            )}
                        </Form.Group>
                    ))}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="tipo">Tipo</Form.Label>
                        <Form.Select
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        >
                            <option value="">Selecione...</option>
                            <option value="Computador">Computador</option>
                            <option value="Telefone">Telefone</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="image">Imagem</Form.Label>
                        <Form.Control
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar Produto'}
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default AddProduct;
