import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../../context/authContext";

const baseURL = "pagapouco-app.herokuapp.com/api";

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${authTokens?.access}` }
    });

    axiosInstance.interceptors.request.use(async req => {
        if (!authTokens?.access) {
            return req; // Se não houver token de acesso, apenas retorna a requisição
        }

        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
            return req; // Se o token não estiver expirado, retorna a requisição
        }

        try {
            const response = await axios.post(`${baseURL}/token/refresh/`, {
                refresh: authTokens.refresh
            });

            localStorage.setItem("authTokens", JSON.stringify(response.data));
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        } catch (error) {
            console.error("Erro ao atualizar o token:", error);
            // Limpar os tokens e redirecionar ou tratar conforme necessário
            localStorage.removeItem("authTokens");
            setAuthTokens(null);
            setUser(null);
            // Você pode redirecionar para a página de login ou fazer outra ação
            return Promise.reject(error); // Rejeita a requisição para que o erro possa ser tratado onde necessário
        }
    });

    return axiosInstance;
}

export default useAxios;
