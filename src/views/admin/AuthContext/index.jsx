// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider2 = ({ children }) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    console.log("context decoded.is_staff "+decoded.is_staff)

    const isAdmin = () => (decoded.is_staff) // Verifica se o usuário é admin
    const isSeller=()=>(decoded.eComprador)

    return (
        <AuthContext.Provider value={{token, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
