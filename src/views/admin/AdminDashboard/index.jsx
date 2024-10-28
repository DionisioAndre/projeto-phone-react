import { Link, Outlet } from "react-router-dom";
import './AdminDashboard.css';
import { useAuth } from '../../../context/dedica';
import {Container} from 'react-bootstrap';


const AdminDashboard = () => {
    const { token, isAdmin,isSeller } = useAuth();
    if(!isAdmin) return <p>Acesso negado</p>
    return (
        <div className="custom-background">
            <Container className="mt-5">
        <div className="admin-dashboard" style={{ backgroundColor: '#E89BA8', padding: '20px', minHeight: '100vh' }}>
            <h1 className="text-white">Painel Administrativo</h1>
            <nav className="mb-4">
                <Link to="/UserManagement" className="btn btn-primary me-2">Gerenciar Usuários</Link>
                <Link to="/admin/products" className="btn btn-primary me-2">Gerenciar Produtos</Link>
                <Link to="/admin/orders" className="btn btn-primary">Gerenciar Pedidos</Link>
                <Link to="CreateSuperUser" className="btn btn-primary">Gerenciar SuperUser</Link>
            </nav>
            <Outlet />
        </div>
        </Container>
    </div>
    );
};

export default AdminDashboard;
