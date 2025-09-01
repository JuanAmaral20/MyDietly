import { useNavigate } from "react-router-dom";
import { HeartHandshake, User, LogOut } from "lucide-react";
import "./index.css";
import api from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <div>
      <div className="header-dashboard">
        <div className="logo-dashboard">
          <HeartHandshake />
          <h2>My Dietly</h2>
        </div>
        <div className="user-actions">
          <div className="user-info">
            <User className="user-icon" />
            <span className="user-name">Usuário</span>
          </div>
          <button onClick={handleLogout} className="logout-container">
            <LogOut className="logout-icon" />
            <span className="logout-button">Sair</span>
          </button>
        </div>
      </div>
      <div className="content-dashboard">
        <h1 className="text-intro">Vamos criar sua dieta personalizada!</h1>
        <p className="text-description">
          Preencha as informações abaixo para gerar um plano alimentar adequado
          aos seus <br /> objetivos
        </p>
      </div>
      <div className="info-section">
        <h3 className="your-info">Suas informações</h3>
        <p className="info-description">
          Quanto mais preciso, melhor será sua dieta
        </p>
      </div>
      <div>
        <form action="">
          <div>
            <label htmlFor="weight">Peso atual (kg)*:</label>
            <input type="number" id="weight" name="weight" min="0" required />
          </div>
          <div>
            <label htmlFor="age">Idade (anos)*:</label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              max="120"
              required
            />
          </div>
          <div>
            <label htmlFor="height">Altura (cm)*:</label>
            <input type="number" id="height" name="height" min="0" required />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
