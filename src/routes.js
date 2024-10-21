import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/authContext';
function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                   
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRoutes;
