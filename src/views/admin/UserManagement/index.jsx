import { useEffect, useState } from "react";
import axios from "axios";
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/routeradmin/products/"); // Ajuste a URL conforme sua API
                setUsers(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="card" style={{ backgroundColor: '#A2C2D4', padding: '20px', borderRadius: '10px' }}>
            <h2 className="text-white">Usuários</h2>
            <table className="table text-white">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}{console.log(user.id.username)} </td>
                            <td>{user.id.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="btn btn-light">Editar</button>
                                <button className="btn btn-danger ms-2">Remover</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
