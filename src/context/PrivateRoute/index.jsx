import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { jwtDecode } from 'jwt-decode';
import Unauthorized from "../../views/Unauthorized";
const PrivateRoute = ({ children, isSeller }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("authToken");
    
    useEffect(() => {
        // Se não houver usuário, redireciona para a página de login
        if(token){
            const decoded = jwtDecode(token);
            const isAdmin = () => (decoded.is_staff)
        }
        if (!user) {
            navigate('/loginpage');
        } else if (isSeller && !user.eComprador) { // Se é uma rota de vendedor e o usuário não é vendedor, redireciona
            navigate('/');
        } 
    }, [user, navigate, isSeller]);

    // Retorna children apenas se o usuário estiver autenticado e atender às condições
    return user ? children : <Unauthorized/>;
};

export default PrivateRoute;
