import { getItem, logoutUser, setItem } from '../../services/localStorege'; 
import { useCallback, useEffect, useState } from "react";
import { BsFillCartDashFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; 
import './Carrinho.css';
import { jwtDecode } from 'jwt-decode';

export const Cart = () => {
    const [data, setData] = useState(() => getItem('carrinhoXt') || []);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState([]);
    const [formOther, setFormOther] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const token = localStorage.getItem('authToken');
    const d  = jwtDecode(token);

    const sanitizeInput = (input) => {
        return input.replace(/<script.*?>.*?<\/script>/gi, '').trim(); // Remove scripts
    };

    const handleChange = useCallback((e, id) => {
        const { name, value } = e.target;
        setFormOther(prevData => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                [name]: (name === 'quantity' || name === 'prestacao') ? (isNaN(value) ? '' : Math.max(0, parseFloat(value))) : value,
                addedToOrder: false
            }
        }));
    }, []);

    const removeItem = (obj) => {
        const updatedData = data.filter((e) => e.id !== obj.id);
        setData(updatedData);
        calculateTotal();
    };

    const calculateTotal = useCallback(() => {
        const total = formData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);
    }, [formData]);

    useEffect(() => {
        setItem('carrinhoXt', data);
    }, [data]);

    const formatImageUrl = (url) => url.replace('/media/', '/api/media/');
    const urlToFile = async (url, filename, mimeType) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: mimeType });
    };

    const enviar = async (e) => {
        const currentForm = formOther[e.id] || {};
        if (!currentForm.quantity || !currentForm.prestacao) {
            alert("Por favor, preencha a quantidade e a prestação.");
            return;
        }
        
        const imgFile = await urlToFile(formatImageUrl(e.image), `${e.image}.png`, 'image/png');

        const existingItemIndex = formData.findIndex(item => item.product === e.id);
        if (existingItemIndex >= 0) {
            const updatedFormData = [...formData];
            updatedFormData[existingItemIndex].quantity += Number(currentForm.quantity);
            setFormData(updatedFormData);
        } else {
            const newItem = {
                product: e.id,
                price: Number(e.price),
                quantity: Number(currentForm.quantity),
                prestacao: Number(currentForm.prestacao),
                img: imgFile
            };
            setFormData(prevFormData => [...prevFormData, newItem]);
            calculateTotal();
        }

        setFormOther(prev => ({
            ...prev,
            [e.id]: {
                ...prev[e.id],
                addedToOrder: true
            }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setLoadingTimeout(false);

        const timeoutId = setTimeout(() => {
            setLoadingTimeout(true);
        }, 5000);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Token de autenticação não encontrado.");

            const { user_id: buyerId } = jwtDecode(token);
            
            if (formData.length === 0) {
                alert("Erro! Criou pedido vazio, por favor adicione antes de enviar");
                return;
            }

            for (const item of formData) {
                const formDataToSend = new FormData();
                formDataToSend.append('buyer', buyerId);
                formDataToSend.append('product', item.product);
                formDataToSend.append('price', item.price);
                formDataToSend.append('prestacao', item.prestacao);
                formDataToSend.append('quantity', item.quantity);
                const image = item.img;
                formDataToSend.append('image', image);

                await axios.post('http://127.0.0.1:8000/api/routerorders/', formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            alert("Pedido criado com sucesso");
            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.error || "Ocorreu um erro ao criar a ordem.";
            setError(errorMessage);
            
            if (err.response && err.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(errorMessage);
            }
            
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
            setLoadingTimeout(false);
        }
    };

    if (loading) {
        return (
            <div>
                {loadingTimeout ? (
                    <p>O carregamento está demorando mais do que o esperado. Por favor, aguarde...</p>
                ) : (
                    <Loading />
                )}
            </div>
        );
    }

    return (
        <div className="custom-background">
        <div className="container mt-5 custom-background">
            <div className="row">
                {data.map((e) => (
                    <div key={e.id} className="col-md-4 mb-4">
                        <div className="card custom-card">
                            <img src={formatImageUrl(e.image)} alt={e.name || "Produto"} className="card-img-top cor" />
                            <div className="card-body">
                                <h5 className="card-title" style={{ color: '#2E4C6D' }}>{e.name}</h5>
                                <p className="card-text" style={{ color: '#333333' }}>Preço: R$ {e.price}</p>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor={`prestacao-${e.id}`}>Prestação</label>
                                        <input
                                            type="number"
                                            id={`prestacao-${e.id}`}
                                            name="prestacao"
                                            className="form-control"
                                            value={formOther[e.id]?.prestacao || ''}
                                            onChange={(event) => handleChange(event, e.id)}
                                            required
                                            min="0"
                                            max="4"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`quantity-${e.id}`}>Quantidade</label>
                                        <input
                                            type="number"
                                            id={`quantity-${e.id}`}
                                            name="quantity"
                                            className="form-control"
                                            value={formOther[e.id]?.quantity || ''}
                                            onChange={(event) => handleChange(event, e.id)}
                                            required
                                            min="1"
                                        />
                                    </div>
                                </form>
                                <button 
                                    className="btn btn-cart" 
                                    onClick={() => removeItem(e)} 
                                    aria-label={`Remover ${e.name}`}
                                >
                                    <BsFillCartDashFill /> Remover
                                </button>

                                <button 
                                    className={`btn btn-cart ml-2 ${formOther[e.id]?.addedToOrder ? 'disabled' : ''}`} 
                                    style={{ 
                                        backgroundColor: formOther[e.id]?.addedToOrder ? '#cccccc' : '#0033cc',
                                        color: '#FFFFFF' 
                                    }}
                                    onClick={() => enviar(e)}
                                    disabled={formOther[e.id]?.addedToOrder}
                                >
                                    Adicionar ao Pedido
                                </button>

                                {formOther[e.id]?.quantity && (
                                    <p>Total do produto: R$ {(Number(e.price) * Number(formOther[e.id]?.quantity)).toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {formData.length > 1 && (
                <div className="mt-3">
                    <h5>Tudo pronto!</h5>
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
                <button type="submit" className="btn" style={{ backgroundColor: '#2E4C6D', color: '#FFFFFF' }}>
                    Criar Pedido
                </button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
        </div>
        </div>
    );
};
