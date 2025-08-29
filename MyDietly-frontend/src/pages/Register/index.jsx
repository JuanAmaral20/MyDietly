import "./index.css";
import { HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Register = () => {

  async function registerUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if(data.password !== data["confirm-password"]){
      alert("As senhas não coincidem. Por favor, tente novamente.");
      return;
    }
    try {
      const { confirmPassword, ...apiData } = data;
      const response = await api.post("/users", apiData);
      console.log("User registered successfully:", response.data);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  return (
    <div className="gradient-background-blue-green">
      <div className="container-general-register">
        <div className="container-register">
          <div className="header-register">
            <div className="welcome-mydietly-register">
              <HeartHandshake />
              <Link className="link-to-home" to="/">My Dietly</Link>
            </div>
            <h3 className="register-now">Crie sua conta</h3>
            <p className="register-description">
              Comece sua jornada para uma vida mais saudável
            </p>
          </div>
          <form onSubmit={registerUser} className="form-register">
            <div className="input-group">
              <label htmlFor="name">Nome Completo</label>
              <input
                className="input-default"
                type="text"
                id="name"
                name="name"
                placeholder="Digite seu nome"
              />
            </div>
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
            <div className="input-group">
              <label htmlFor="confirm-password">Confirmar senha</label>
              <input
                className="input-default"
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirme sua senha"
              />
            </div>
            <div className="button-register">
              <button type="submit">Criar Conta</button>
            </div>
          </form>
          <div className="login-redirect">
            <p>Já tem uma conta?</p>
            <a href="/login">Entrar</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
