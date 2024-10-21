import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const OrderForm = ({ order }) => {
    const [formData, setFormData] = useState({
        buyer: order ? order.buyer : '',
        product: order ? order.product : '',
        price: order ? order.price : '',
        quantity: order ? order.quantity : '',
        prestacao: order ? order.prestacao : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = order ? `/api/orders/${order.id}/` : '/api/orders/';
        const method = order ? 'put' : 'post';

        await axios[method](url, formData);
        // Redirecionar ou fazer outra ação após o envio
    };

    return (
        <div className="container" style={{ backgroundColor: '#E89BA8', padding: '20px', borderRadius: '8px' }}>
            <h2 className="text-white">{order ? 'Editar Pedido' : 'Criar Pedido'}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className="text-white">Comprador</Form.Label>
                    <Form.Control type="text" name="buyer" value={formData.buyer} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-white">Produto</Form.Label>
                    <Form.Control type="text" name="product" value={formData.product} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-white">Preço</Form.Label>
                    <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-white">Quantidade</Form.Label>
                    <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-white">Prestação</Form.Label>
                    <Form.Control type="number" name="prestacao" value={formData.prestacao} onChange={handleChange} required />
                </Form.Group>
                <Button type="submit" style={{ backgroundColor: '#2E4C6D', color: 'white' }}>
                    {order ? 'Atualizar' : 'Criar'}
                </Button>
            </Form>
        </div>
    );
};

export default OrderForm;
