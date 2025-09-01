import { HeartHandshake } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./index.css";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

     async function loginUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if(!data.email || !data.password) {
          alert("Por favor, preencha todos os campos.");
          return;
        }

        try{
            const response = await api.post("/users/login", data);
            console.log("Login bem-sucedido:", response.data);

            const { token } = response.data;
            if(token){
                localStorage.setItem("authToken", token);
                navigate("/dashboard");
            } else{
                throw new Error("Token de autenticação não recebido.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "E-mail ou senha inválidos.";
             if (errorMessage.includes('Invalid email or password')) {
                alert("E-mail ou senha inválidos. Por favor, tente novamente.");
            } else {
                alert(errorMessage);
            }
            console.error("Erro ao fazer login:", error);
        }
    }
    return ( 
    <div className="gradient-background-blue-green">
      <div className="container-general-login">
        <div className="container-login">
          <div className="header-login">
            <Link className="welcome-mydietly-login" to="/">
              <HeartHandshake />
              <p className="link-to-home">My Dietly</p>
            </Link>
            <h3 className="welcome-login">Bem vindo de volta!</h3>
            <p className="login-description">
              Entre na sua conta para continuar sua jornada de saúde
            </p>
          </div>
          <form className="form-login" onSubmit={loginUser}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                className="input-default"
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu email"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                className="input-default"
                type="password"
                id="password"
                name="password"
                placeholder="Digite sua senha"
              />
            </div>
            <div className="button-login">
              <button type="submit">Entrar</button>
            </div>
          </form>
          <div className="redirect">
            <p>Não tem uma conta?</p>
            <a href="/register"> Criar conta</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;