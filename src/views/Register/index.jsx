import React, { useState, useContext } from 'react';
import AuthContext from '../../context/authContext';
import './Register.css';
import img1 from './category.svg'
import Loading from '../../components/Loading';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '').trim(); // Remove todas as tags HTML
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isBuyer, setIsBuyer] = useState(true);
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const { registerUser } = useContext(AuthContext);

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setIsBuyer(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        setLoadingTimeout(false);

        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);
        const sanitizedConfirmPassword = sanitizeInput(confirmPassword);
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPhone = sanitizeInput(phone);

        if (sanitizedEmail && sanitizedPassword && sanitizedUsername && sanitizedPhone) {
            const timeoutId = setTimeout(() => {
                setLoadingTimeout(true);
            }, 5000);

            try {
                const success = await registerUser(sanitizedEmail, sanitizedUsername, sanitizedPhone, isBuyer, sanitizedPassword, sanitizedConfirmPassword);
                if (success) {
                    alert('Registro bem-sucedido!');
                    resetForm();
                }
            } catch (error) {
                const message = error?.response?.data?.error || 'Erro ao registrar. Tente novamente.';
                setErrorMessage(message);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
                setLoadingTimeout(false);
            }
        } else {
            setErrorMessage("Preencha todos os campos.");
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
        <Container className="mt-5">
            <h2 className="h2 fw-bold mb-0 text-center">Registrar</h2>
            <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
             <img src={img1} alt="login" className="img-flui"
                style={{ borderRadius: "1rem 0 0 1rem" }} />
            </div>
            <div className="col-md-6 col-lg-7 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3 form-check">
                    <Form.Check 
                        type="checkbox"
                        label="Sou comprador"
                        checked={isBuyer}
                        onChange={() => setIsBuyer(!isBuyer)}
                    />
                </Form.Group>
                <Button className="custom-btn" type="submit">Registrar</Button>
            </Form>
            </div>
            </div>
            </div>
        </Container>
        </div>
    );
}

export default Register;
