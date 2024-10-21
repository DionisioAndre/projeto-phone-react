import { useContext, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Loading from '../../components/Loading'; // Certifique-se de que o caminho está correto
import "./LoginPage.css";

function LoginPage() {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Para armazenar mensagens de erro

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target;

        if (email.value.length > 0 && password.value.length > 0) {
            setLoading(true);
            setLoadingTimeout(false);
            setErrorMessage(""); // Reseta a mensagem de erro

            const timeoutId = setTimeout(() => {
                setLoadingTimeout(true);
            }, 5000);

            try {
                await loginUser(email.value, password.value);
                console.log("Login bem-sucedido");
                navigate("/");
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                setErrorMessage("Credenciais inválidas. Tente novamente."); // Exibe mensagem de erro
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
                setLoadingTimeout(false);
            }
        } else {
            setErrorMessage("Email ou senha estão vazios.");
        }
    };

    if (loading) {
        return (
            <div>
                {loadingTimeout ? (
                    <p>O carregamento está demorando mais do que o esperado. Por favor, aguarde...</p>
                ) : (
                    <Loading />
                )}
            </div>
        );
    }

    return (
        <div className="container mt-5 custom-background">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-6">
                    <div className="card custom-card shadow">
                        <div className="row g-0">
                            <div className="col-md-6 d-none d-md-block">
                                <img src="link-para-sua-imagem.jpg" alt="login" className="img-fluid rounded-start" />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <div className="card-body">
                                    <h2 className="text-center mb-4 text-primary">Bem-vindo ao <b>Desphis</b></h2>
                                    {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Exibe a mensagem de erro */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-outline mb-4">
                                            <input 
                                                name="email" 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Email" 
                                                required 
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input 
                                                name="password" 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Senha" 
                                                required 
                                            />
                                        </div>
                                        <button className="btn btn-primary btn-block" type="submit">Entrar</button>
                                        <div className="text-center mt-3">
                                            <Link to="#" className="small text-muted">Esqueceu a senha?</Link>
                                            <p className="mt-3" style={{ color: "#393f81" }}>
                                                Não tem uma conta? <Link to="/register" className="text-primary">Registrar aqui</Link>
                                            </p>
                                            <Link to="#" className="small text-muted">Termos e uso</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
