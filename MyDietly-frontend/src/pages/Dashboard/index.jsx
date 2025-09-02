import { useNavigate } from "react-router-dom";
import { HeartHandshake, User, LogOut } from "lucide-react";
import "./index.css";
import api from "../../services/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedGoal, setSelectedGoal] = useState("");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await api.get("/users");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await api.get("/goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Failed to fetch goals", error);
      }
    }
    fetchGoals();
  }, []);

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
            <span className="user-name">{userInfo.name}</span>
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
      <div className="form-section">
        <form className="diet-form" action="">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Peso atual (kg)*:</label>
              <input type="number" id="weight" name="weight" min="0" required placeholder="Ex: 70"/>
            </div>
            <div className="form-group">
              <label htmlFor="age">Idade (anos)*:</label>
              <input
                type="number"
                id="age"
                name="age"
                min="0"
                max="120"
                required
                placeholder="Ex: 170"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Altura (cm)*:</label>
              <input type="number" id="height" name="height" min="0" required placeholder="Ex: 25" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goal">Qual é o seu objetivo? *</label>
              <select
                id="goalId"
                name="goalId" 
                className="select-default" 
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                required
              >
                <option className="goal-option" value="" disabled>
                  Selecione um objetivo
                </option>
                {goals.map((goal) => (
                  <option className="goal-option" key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="activityLevel">Nível de atividade física:</label>
              <select id="activityLevel" name="activityLevel" required>
                <option value="">Selecione um nível</option>
                <option value="sedentary">Sedentário</option>
                <option value="lightly_active">Levemente ativo</option>
                <option value="moderately_active">Ativo moderado</option>
                <option value="very_active">Muito ativo</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="foodAllergy">
                Alergias alimentares (opcional):
              </label>
              <input type="text" id="foodAllergy" name="foodAllergy" placeholder="Ex: Glúten, Lactose, amendoim..." />
            </div>
            <div className="form-group">
              <label htmlFor="conditions">
                Doenças ou condições (opcional):
              </label>
              <input type="text" id="conditions" name="conditions" placeholder="Ex: Diabetes, Hipertensão..." />
            </div>
          </div>
          <button className="generate-diet-button">Gerar Dieta</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
