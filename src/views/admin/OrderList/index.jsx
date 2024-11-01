import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/authContext';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Container } from 'react-bootstrap';

import Loading from '../../../components/Loading';
import { logoutUser } from '../../../services/localStorege';
import './OrderList.css';

const OrderList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setorders] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedorder, setSelectedorder] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchorders = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const response = await axios.get('https://pagapouco.onrender.com/api/routeradmin/orders/', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setorders(response.data);
            } catch (err) {
                setError('Erro ao buscar produtos.');
                if (err.response.status === 401) {
                    alert("A sessao expirou! por favor faça o iogin");
                    logoutUser(); // Corrigido para chamar a função
                    navigate('/loginpage');
                } else {
                    alert(error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchorders();
    }, [user]);

    const formatImageUrl = (url) => url.replace('/media/', '/api/media/');

    const handleDelete = async (orderId) => {
        if (window.confirm('Tem certeza que deseja apagar este produto?')) {
            try {
                await axios.delete(`https://pagapouco.onrender.com/api/routeradmin/orders/${orderId}/`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setorders(orders.filter(order => order.id !== orderId));
            } catch (err) {
                setError('Erro ao apagar produto.');
                if (err.response.status === 401) {
                    alert("A sessao expirou! por favor faça o iogin");
                    logoutUser(); // Corrigido para chamar a função
                    navigate('/loginpage');
                } else {
                    alert(error);
                }
            }
        }
    };

    const handleUpdate = (order) => {
        setSelectedorder(order);
        setName(order.name);
        setTipo(order.tipo);
        setPrice(order.price);
        setDescription(order.description);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (newImage) formData.append('image', newImage);
        formData.append('name', name);
        formData.append('tipo', tipo);
        formData.append('price', price);
        formData.append('description', description);

        try {
            await axios.put(`https://pagapouco.onrender.com/api/orderUpdateView/${selectedorder.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            resetForm();
            await fetchorders();
        } catch (err) {
            setError('Erro ao atualizar produto.');
            if (err.response.status === 401) {
                alert("A sessao expirou! por favor faça o iogin");
                logoutUser(); // Corrigido para chamar a função
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

    const fetchorders = async () => {
        if (!user) return;

        try {
            const response = await axios.get('https://pagapouco.onrender.com/api/routeradmin/orders/', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setorders(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
            if (err.response.status === 401) {
                alert("A sessao expirou! por favor faça o iogin");
                logoutUser(); // Corrigido para chamar a função
                navigate('/loginpage');
            } else {
                alert(error);
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="custom-background">
            <Container className="mt-5">
                <div>
                    <h2>Lista de Produtos</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="row">
                        {orders.map(order => (
                            <div key={order.id} className="col-md-4 mb-4">
                                <h3>Pedido ID: {order.id}</h3>
                                <h3>Pedido Buyer: {order.buyer}</h3>
                                <img src={formatImageUrl(order.image)} alt="imagem" className="card-img-top cor" />
                                <p className="card-text">produto: {order.product}</p>
                                <p className="card-text">Preço: KZ{order.price}</p>
                                <p>Quantidade: {order.quantity}</p>
                                <p>Data do Pedido: {new Date(order.created_at).toLocaleDateString()}</p>
                                <Button variant="danger" onClick={() => handleDelete(order.id)}>Apagar</Button>
                                <hr />
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
            </Container>
        </div>
    );
};

export default OrderList;
