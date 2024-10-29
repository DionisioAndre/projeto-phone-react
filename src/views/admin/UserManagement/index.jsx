import { useContext, useEffect, useState } from "react"; 
import axios from "axios";
import './UserManagement.css';
import AuthContext from '../../../context/authContext';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Table,Container } from 'react-bootstrap';


const UserManagement = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.get("https://pagapouco.onrender.com/api/routeradmin/users/", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user, logoutUser, navigate]);

    const handleDelete = async (userId) => {
        if (window.confirm('Tem certeza que deseja apagar este usuário?')) {
            try {
                await axios.delete(`https://pagapouco.onrender.com/api/routeradmin/users/${userId}/`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                setError('Erro ao apagar usuário.');
                if (error.response && error.response.status === 401) {
                    alert("A sessão expirou! Por favor, faça o login.");
                    logoutUser();
                    navigate('/loginpage');
                } else {
                    alert(error.message);
                }
            }
        }
    };

    const handleUpdate = (userToUpdate) => {
        setSelectedUser(userToUpdate);
        setName(userToUpdate.name);
        setUsername(userToUpdate.username);
        setEmail(userToUpdate.email);
        setTelefone(userToUpdate.telefone);
        setIsStaff(userToUpdate.is_staff);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('telefone', telefone);
        formData.append('is_staff', isStaff);

        try {
            await axios.put(`https://pagapouco.onrender.com/api/routeradmin/users/${selectedUser.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            resetForm();
            fetchUsers(); // Atualiza a lista após a atualização
        } catch (error) {
            setError('Erro ao atualizar usuário.');
            if (error.response && error.response.status === 401) {
                alert("A sessão expirou! Por favor, faça o login.");
                logoutUser();
                navigate('/loginpage');
            } else {
                alert(error.message);
            }
        }
    };

    const resetForm = () => {
        setName('');
        setUsername('');
        setEmail('');
        setTelefone('');
        setIsStaff(false);
    };

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="custom-background">
      <Container className="mt-5">
        <div className="card custom-card">
            <h2 className="text-white">Usuários</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.telefone}</td>
                            <td>
                                <Button variant="light" onClick={() => handleUpdate(user)}>Editar</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleDelete(user.id)}>Remover</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para atualizar usuário */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Atualizar usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Telefone</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={telefone} 
                                onChange={(e) => setTelefone(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3 form-check">
                            <input 
                                type="checkbox" 
                                className="form-check-input" 
                                checked={isStaff} 
                                onChange={(e) => setIsStaff(e.target.checked)} 
                            />
                            <label className="form-check-label">Adicionar ao Staff</label>
                        </div>
                        <Button variant="primary" type="submit">Atualizar</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
        </Container>
    </div>
    );
};

export default UserManagement;
