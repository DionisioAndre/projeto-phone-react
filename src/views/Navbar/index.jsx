import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { jwtDecode } from "jwt-decode";
import { Navbar, Nav, Container } from "react-bootstrap";
import './Navbar.css'; // Mantém o CSS para ajustes adicionais, se necessário

function CustomNavbar() {
    const { user, logoutUser } = useContext(AuthContext);
    const token = localStorage.getItem("authToken");

    const isAdmin = () => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.is_staff || false;
        } catch (error) {
            return false;
        }
    };

    const isBuyer = () => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.eComprador === true;
        } catch (error) {
            return false;
        }
    };

    const isAuthenticated = Boolean(token);

    return (
        <header>
            <Navbar expand="lg" fixed="top" className="custom-navbar">
                <Container>
                    <Link to="/" className="navbar-brand">
                        Pagapouco
                        <img
                            style={{ width: "120px", padding: "6px" }}
                            src="/path/to/logo.png"
                            alt="Logotipo da Pagapouco"
                        />
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="nav-link" aria-current="page">Home</Link>
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/loginpage" className="nav-link">Login</Link>
                                    <Link to="/register" className="nav-link">Registrar</Link>
                                </>
                            ) : isBuyer() && !isAdmin() ? (
                                <>
                                    <Link to="/carrinho" className="nav-link">Carrinho</Link>
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</Link>
                                </>
                            ) : isAdmin() ? (
                                <>
                                    <Link to="/AdminDashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/add-product" className="nav-link">Adicionar Produtos</Link>
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/add-product" className="nav-link">Adicionar Produtos</Link>
                                    <Link to="/productslist" className="nav-link">Editar Produtos</Link>
                                    <Link to="/ver-pedidos" className="nav-link">Ver Pedidos de Compras</Link>
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default CustomNavbar;
