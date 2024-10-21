import React, { useState, useContext } from 'react';
import AuthContext from '../../context/authContext';
import './Register.css';
import Loading from '../../components/Loading';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [eComprador, seteComprador] = useState(true);
    const [password, setPassword] = useState('');
    const [telefone, setTelefone] = useState('');  // Alterado para string
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const { registerUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        setLoadingTimeout(false);

        const timeoutId = setTimeout(() => {
            setLoadingTimeout(true);
        }, 5000);

        try {
            if(await registerUser(email, username, telefone, eComprador, password, password2))
            alert('Registro bem-sucedido!');
            // Aqui, você pode redircionar o usuário ou fazer outra ação após o registro
        } catch (error) {
            const message = error?.response?.data?.error || 'Erro ao registrar. Tente novamente.';
            setErrorMessage(message);
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
        <div className="container mt-5">
            <h2 className="text-center">Registrar</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"  // Alterado para text
                        className="form-control"
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}  // Mudança aqui
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmar Senha"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 form-check">
                    <label className="form-check-label">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={eComprador}
                            onChange={() => seteComprador(!eComprador)}
                        />
                        Sou comprador
                    </label>
                </div>
                <button className="btn btn-primary custom-btn" type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
