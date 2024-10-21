import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
    


const dedica = createContext();

export const AuthProvider2 = ({ children }) => {
    const token = localStorage.getItem("authToken");
    const navigate=useNavigate()
    if(!token){
        
        return navigate("/loginpage")
    }
    const decoded = jwtDecode(token);
    console.log("context decoded.is_staff "+decoded.is_staff)

    const isAdmin = () => (decoded.is_staff) // Verifica se o usuário é admin
    const isSeller=()=>(decoded.eComprador)

    return (
        <dedica.Provider value={{token, isAdmin,isSeller }}>
            {children}
        </dedica.Provider>
    );
};

export const useAuth = () => useContext(dedica);
