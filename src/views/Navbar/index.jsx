import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { jwtDecode } from "jwt-decode";
import './Navbar.css';

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    const token = localStorage.getItem("authToken");
    const isAdmin = () => {
        
        if (!token){
            return false;
        } 
        try {
            
            const decoded = jwtDecode(token);
            if(decoded.is_staff){
                console.log("sou admin")
                return true;
            }
        } catch (error) {
            console.error("Token inválido ou não encontrado:", error);
            return false;
        }
    };

    const isBuyer = () => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            if(decoded.eComprador === true){

                return decoded.eComprador === true;

            }
        } catch (error) {
            console.error("Token inválido ou não encontrado:", error);
            return false;
        }
    };
    const isAuthenticated = Boolean(token);

    return (
        <header>
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar" style={{ marginBottom: '20px' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand" aria-label="Página inicial">
                    Pagapouco
                    <img
                        style={{ width: "120px", padding: "6px" }}
                        src="/path/to/logo.png"
                        alt="Logotipo da Pagapouco"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Alternar navegação"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/loginpage" className="nav-link" aria-label="Ir para página de login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link" aria-label="Ir para página de registro">Registrar</Link>
                                </li>
                            </>
                        ) : (isBuyer()&& (!isAdmin())) ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/carrinho" className="nav-link" aria-label="Ir para o carrinho">Carrinho</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }} aria-label="Logout">Logout</Link>
                                </li>
                            </>
                        ) : isAdmin() ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/AdminDashboard" className="nav-link" aria-label="Ir para o dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/add-product" className="nav-link" aria-label="Adicionar produtos">Adicionar Produtos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }} aria-label="Logout">Logout</Link>
                                </li>
                            </>
                        ) : ((!isBuyer())&& (!isAdmin())) ? (
                            <>
                            {console.log("vendedor "+(!isBuyer()))}
                                <li className="nav-item">
                                    <Link to="/add-product" className="nav-link" aria-label="Adicionar produtos">Adicionar Produtos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/productslist" className="nav-link" aria-label="Editar produtos">Editar Produtos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/ver-pedidos" className="nav-link" aria-label="Ver pedidos de compras">Ver Pedidos de Compras</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }} aria-label="Logout">Logout</Link>
                                </li>
                            </>
                        ) : (
                            <>
                            <li className="nav-item">
                                    <Link className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }} aria-label="Logout">Logout</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
        </header>
    );
}

export default Navbar;
