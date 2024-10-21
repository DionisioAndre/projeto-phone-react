

import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Navbar from './views/Navbar';
import Loginpage from './views/LoginPage';
import { Cart } from './views/Cart';
import Register from './views/Register';
import { Store } from './views/store';
import ProductList from "./views/Products/ProductList";
import AddProduct from "./views/Products/AddProduct";
import Orderlist from "./views/Orders/Orderlist";
import PrivateRoute from './context/PrivateRoute';
import { ProductProvider } from "./img/ProductContext";
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
//local admin
import { AuthProvider2 } from "./context/dedica";
import ProductManagement from "./views/admin/ProductManagement";
import OrderList from "./views/admin/OrderList";
import AdminDashboard from './views/admin/AdminDashboard';
import UserManagement from './views/admin/UserManagement';
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>                    
                    <Route element={<Loginpage />} path='/loginpage' />
                    <Route element={<Register />} path='/register' />
                    <Route element={<ProductProvider><Store/></ProductProvider>} path='/' />
                    {/* Rotas vendedor */}
                    <Route element={<PrivateRoute> <AuthProvider2><ProductList /></AuthProvider2></PrivateRoute>} path="/productslist" />
                    <Route element={<PrivateRoute><AuthProvider2><AddProduct /></AuthProvider2></PrivateRoute>} path="/add-product" />
                    <Route element={<PrivateRoute><AuthProvider2><Orderlist /></AuthProvider2></PrivateRoute>} path="/ver-pedidos" />
 
                    {/* Rotas comprador */}
                    <Route element={<AuthProvider2><Cart /></AuthProvider2>} path='/carrinho' exact />
                    
                    
                        {/* Rotas admin */}
                    <Route element={<PrivateRoute> <AuthProvider2><AdminDashboard /></AuthProvider2> </PrivateRoute> } path="/AdminDashboard" />
                    <Route element={<AuthProvider2><ProductManagement /> </AuthProvider2> } path="/admin/products" />
                    <Route element={<AuthProvider2><OrderList /> </AuthProvider2> } path="/admin/orders" />
                    <Route element={<UserManagement />} path="/UserManagement" />
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;