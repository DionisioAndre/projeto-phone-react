import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../../context/authContext';
import { Button, Container } from 'react-bootstrap';
import "./Orderlist.css";

const Orderlist = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logoutUser } = useContext(AuthContext); // Certifique-se de que logoutUser está disponível aqui

  const handleDelete = async (ordersId) => {
    if (window.confirm('Tem certeza que deseja apagar este pedido?')) {
      try {
        await axios.delete(`https://pagapouco.onrender.com/api/routerorders/${ordersId}/`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setOrders(orders.filter(order => order.id !== ordersId));
      } catch (err) {
        setError('Erro ao apagar produto.');
        if (err.response && err.response.status === 401) {
          alert("A sessão expirou! Por favor, faça o login");
          logoutUser(); // Chamada da função
          navigate('/loginpage');
        } else {
          alert(error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://pagapouco.onrender.com/api/seller/orders/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
        if (err.response && err.response.status === 401) {
          alert("A sessão expirou! Por favor, faça o login");
          logoutUser(); // Chamada da função
          navigate('/loginpage');
        } else {
          alert(error);
        }
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
    <div className="custom-background">
      <Container className="mt-5">
        <h2>Meus Pedidos</h2>
        {orders.length === 0 ? (
          <p>Não há pedidos para exibir.</p>
        ) : (
          <ul>
            <div className="row">
              {orders.map(order => (
                <div key={order.id} className="col-md-4 mb-4">
                  <h3>Pedido ID: {order.id}</h3>
                  <Button variant="danger" onClick={() => handleDelete(order.id)}>Apagar</Button>
                  <hr />
                </div>
              ))}
            </div>
          </ul>
        )}
      </Container>
    </div>
  );
};

export default Orderlist;
