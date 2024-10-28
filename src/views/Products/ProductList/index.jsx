import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../../context/authContext';
import { Modal, Button,Container } from 'react-bootstrap';
import Loading from '../../../components/Loading';
import { logoutUser } from '../../../services/localStorege';
import './ProductList.css';

const ProductList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    // Função para sanitizar inputs
    const sanitizeInput = (input) => {
        return input.replace(/<script.*?>.*?<\/script>/gi, '').trim();
    };

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];

        if (!file) {
            setError('Por favor, selecione um arquivo de imagem.');
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            setError('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, GIF).');
            setNewImage(null);
            return;
        }

        setNewImage(file);
        setError('');
    }, []);

    const fetchProducts = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/routerproducts/', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setProducts(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
            if (err.response && err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const formatImageUrl = (url) => url.replace('/media/', '/api/media/');

    const handleDelete = async (productId) => {
        if (window.confirm('Tem certeza que deseja apagar este produto?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/routerproducts/${productId}/`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setProducts(products.filter(product => product.id !== productId));
            } catch (err) {
                setError('Erro ao apagar produto.');
                if (err.response && err.response.status === 401) {
                    alert("A sessão expirou! Por favor, faça o login.");
                    logoutUser();
                    navigate('/loginpage');
                } else {
                    alert(err.message);
                }
            }
        }
    };

    const handleUpdate = (product) => {
        setSelectedProduct(product);
        setName(product.name);
        setTipo(product.tipo);
        setPrice(product.price);
        setDescription(product.description);
        setShowModal(true);
        setNewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (newImage) formData.append('image', newImage);
        formData.append('name', sanitizeInput(name));
        formData.append('tipo', sanitizeInput(tipo));
        formData.append('price', price);
        formData.append('description', sanitizeInput(description));

        try {
            await axios.put(`http://127.0.0.1:8000/api/product-update/${selectedProduct.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            resetForm();
            await fetchProducts();
        } catch (err) {
            setError('Erro ao atualizar produto.');
            if (err.response && err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(err.message);
            }
        }
    };

    const resetForm = () => {
        setNewImage(null);
        setName('');
        setTipo('');
        setPrice('');
        setDescription('');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="custom-background">
            <Container className="mt-5">
            <h2>Lista de Produtos</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img 
                                src={formatImageUrl(product.image)} 
                                alt={product.name} 
                                className="cor" 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.tipo}</p>
                                <p className="card-text">Preço: R$ {product.price}</p>
                                <Button variant="danger" onClick={() => handleDelete(product.id)}>Apagar</Button>
                                <Button variant="primary" onClick={() => handleUpdate(product)}>Atualizar</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para atualizar produto */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Atualizar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={tipo} 
                                onChange={(e) => setTipo(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Preço</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descrição</label>
                            <textarea 
                                className="form-control" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Escolha uma nova imagem (opcional)</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <Button variant="primary" type="submit">Atualizar</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>

        </div>
    );
};

export default ProductList;
