import { Navigate, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";

const PrivateRoute = ({ children, ...rest }) => {
    const { user } = useContext(AuthContext);
    
    return (
        <Route {...rest} element={!user ? <Navigate to="/login" /> : children} />
    );
}

export default PrivateRoute;
