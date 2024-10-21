import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/authContext';
import { Button } from 'react-bootstrap';

const Orderlist = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const formatImageUrl = (url) => url.replace('/media/', '/api/media/');



  const handleDelete = async (ordersId) => {
    if (window.confirm('Tem certeza que deseja apagar este pedido?')) {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/routerorders/${ordersId}/`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setOrders(orders.filter(orders => orders.id !== ordersId));
        } catch (err) {
            setError('Erro ao apagar produto.');
            console.error(err);
        }
    }
};


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/seller/orders/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (

    <div>
      <h2>Meus Pedidos</h2>
      {console.log(orders) }
      {orders.length === 0 ? (
        <p>Não há pedidos para exibir.</p>
      ) : (
        <ul>
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
        </ul>
      )}
    </div>
  );
};

export default Orderlist;
