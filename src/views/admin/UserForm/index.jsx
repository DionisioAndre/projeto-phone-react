import { useEffect, useState } from "react";
import axios from "axios";

const UserForm = ({ userId, onClose }) => {
    const [user, setUser] = useState({ username: '', email: '', isSeller: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                setLoading(true);
                const response = await axios.get(`/api/users/${userId}/`);
                setUser(response.data);
                setLoading(false);
            };
            fetchUser();
        }
    }, [userId]);

    const validate = () => {
        const newErrors = {};
        if (!user.username) {
            newErrors.username = "Nome de usuário é obrigatório.";
        } else if (user.username.length < 3) {
            newErrors.username = "O nome de usuário deve ter pelo menos 3 caracteres.";
        }

        if (!user.email) {
            newErrors.email = "Email é obrigatório.";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Formato de email inválido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (userId) {
                await axios.put(`/api/users/${userId}/`, user);
            } else {
                await axios.post('/api/users/', user);
            }
            onClose();
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Nome de usuário"
                required
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <label>
                <input
                    type="checkbox"
                    name="isSeller"
                    checked={user.isSeller}
                    onChange={handleChange}
                />
                É vendedor?
            </label>
            <button type="submit">Salvar</button>
        </form>
    );
};

export default UserForm;
