import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/authContext';
import { Modal, Button } from 'react-bootstrap';
import Loading from '../../../components/Loading';

const OrderList = () => {
    const { user } = useContext(AuthContext);
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
                const response = await axios.get('http://127.0.0.1:8000/api/routeradmin/orders/', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setorders(response.data);
            } catch (err) {
                setError('Erro ao buscar produtos.');
                console.error(err);
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
                await axios.delete(`http://127.0.0.1:8000/api/routerorders/${orderId}/`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setorders(orders.filter(order => order.id !== orderId));
            } catch (err) {
                setError('Erro ao apagar produto.');
                console.error(err);
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
            await axios.put(`http://127.0.0.1:8000/api/orderUpdateView/${selectedorder.id}/`, formData, {
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
            console.error(err);
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
            const response = await axios.get('http://127.0.0.1:8000/api/routerorders/', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setorders(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
            console.error(err);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h2>Lista de Produtos</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
          {orders.map(order => (
            <div key={order.id}className="col-md-4 mb-4">
              <h3>Pedido ID: {order.id}</h3>
              <img src={formatImageUrl(order.image)} alt="imagem"className="card-img-top" />
              <p className="card-text">Preço: R${order.price}</p>
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
    );
};

export default OrderList;
