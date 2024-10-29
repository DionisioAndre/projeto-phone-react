import axios from 'axios';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/authContext';
import { useContext, useState } from "react";
import './CreateSuperUser.css';
import {Container} from 'react-bootstrap';

const CreateSuperUser = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sanitizeInput = (input) => {
        return input.replace(/<script.*?>.*?<\/script>/gi, '').trim(); // Remove scripts
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Sanitizando as entradas
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPassword = sanitizeInput(password);
        const sanitizedEmail = sanitizeInput(email);

        try {
            const response = await axios.post('https://pagapouco.onrender.com/api/routersuperusers/', {
                username: sanitizedUsername,
                password: sanitizedPassword,
                email: sanitizedEmail,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setSuccess('Superusuário criado com sucesso!');
            resetForm();
            setTimeout(() => {
                navigate('/usuarios'); // Redirecionar após um breve atraso
            }, 2000);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.detail || 'Erro ao criar superusuário.');
            } else {
                setError('Erro de rede. Tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
    };

    return (
        <div className="custom-background">
        <Container className="mt-5">
        <div className="card" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#A2C2D4' }}>
            <h2>Criar Superusuário</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Nome de Usuário</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite seu nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Criar Superusuário'}
                </Button>
            </Form>
        </div>
        </Container>
    </div>
    );
};

export default CreateSuperUser;
