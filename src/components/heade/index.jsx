import './header.css';
import { Link } from 'react-router-dom';
import { getItem, logoutUser } from '../../services/localStorege';
import { useState } from 'react';

export const Header = () => {
    const [user, setUser] = useState(getItem("usuario"));

    const logout = () => {
        if (user && user.nome) {
            alert(user.nome);
        }
        logoutUser("usuario");
        setUser(null); // Atualiza o estado após o logout
        alert("Logout realizado com sucesso"); // Mensagem mais clara
    };

    return (
        <div className='header'>
            <Link to="/">Store</Link>
            {user ? (
                <>
                    <Link to="/cart">Cart</Link>
                    <Link to="/" onClick={logout}>Logout</Link>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
};
