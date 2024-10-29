import React, { useEffect, useState, useContext, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../../context/authContext';
import { Modal, Button, Card } from 'react-bootstrap';
import Loading from '../../../components/Loading';
import { logoutUser } from '../../../services/localStorege';
import './ProductForm.css';

const ProductManagement = () => {
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

    const sanitizeInput = (input) => {
        return input.replace(/<script.*?>.*?<\/script>/gi, '').trim(); // Remove scripts
    };

    const fetchProducts = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/routeradmin/products/', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setProducts(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
            if (err.response && err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Chama a função aqui
    }, [user]);

    const formatImageUrl = (url) => url.replace('/media/', '/api/media/');

    const handleDelete = async (productId) => {
        if (window.confirm('Tem certeza que deseja apagar este produto?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/routeradmin/products/${productId}/`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setProducts(products.filter(product => product.id !== productId));
            } catch (err) {
                setError('Erro ao apagar produto.');
                if (err.response && err.response.status === 401) {
                    alert("A sessão expirou! Por favor, faça o login");
                    logoutUser();
                    navigate('/loginpage');
                } else {
                    alert(error);
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
            setNewImage(null); // Limpa a imagem se for inválida
            return;
        }

        setNewImage(file);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (newImage) formData.append('image', newImage);
        formData.append('name', sanitizeInput(name));
        formData.append('tipo', sanitizeInput(tipo));
        formData.append('price', price);
        formData.append('description', sanitizeInput(description));

        try {
            await axios.put(`http://127.0.0.1:8000/api/product-update/${selectedProduct.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            resetForm();
            fetchProducts(); // Chama a função aqui sem await
        } catch (err) {
            setError('Erro ao atualizar produto.');
            if (err.response && err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(error);
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
            <div className="container mt-5">
                <h2>Lista de Produtos</h2>
                {error && <p className="text-danger">{error}</p>}
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <Card>
                                <Card.Img 
                                    variant="top" 
                                    src={formatImageUrl(product.image)} 
                                    alt={product.name} 
                                    className="cor"
                                />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.tipo}</Card.Text>
                                    <Card.Text>Preço: R$ {product.price}</Card.Text>
                                    <Button variant="danger" onClick={() => handleDelete(product.id)}>Apagar</Button>
                                    <Button variant="primary" onClick={() => handleUpdate(product)}>Atualizar</Button>
                                </Card.Body>
                            </Card>
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
            </div>
        </div>
    );
};

export default ProductManagement;
