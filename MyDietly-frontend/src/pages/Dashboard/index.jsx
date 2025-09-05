import { useNavigate } from "react-router-dom";
import { HeartHandshake, User, LogOut, Target } from "lucide-react";
import "./index.css";
import api from "../../services/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/Spinner";

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedGoal, setSelectedGoal] = useState("");
  const navigate = useNavigate();
  const [generatedDiet, setGeneratedDiet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("--- RENDERIZANDO O DASHBOARD ---");
  console.log("Valor atual de generatedDiet:", generatedDiet);

  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await api.get("/users/me");
        setUserInfo(response.data);
        console.log("Dados do usuário recebidos da API:", response.data);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    }

    async function fetchGoals() {
      try {
        const response = await api.get("/goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Failed to fetch goals", error);
      }
    }

    async function fetchUserDiet() {
      try {
        const response = await api.get("/diets/me");
        if (response.data) {
          console.log("Dieta existente encontrada:", response.data);
          setGeneratedDiet(response.data);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Failed to fetch user diet", error);
        }
      }
    }
    Promise.all([fetchUserInfo(), fetchGoals(), fetchUserDiet()]);
  }, []);

  async function generateMetricAndDiet(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (
      !data.weight ||
      !data.age ||
      !data.height ||
      !data.goalId ||
      !data.activityLevel
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);
    setGeneratedDiet(null);

    try {
      const metricData = {
        weight: parseFloat(data.weight),
        age: parseInt(data.age, 10),
        height: parseFloat(data.height),
        goalId: data.goalId,
        activityLevel: data.activityLevel,
        foodAllergy: data.foodAllergy || null,
        diseasesOrConditions: data.diseasesOrConditions || null,
      };

      const response = await api.post("/gemini/diet-tip", metricData);
      console.log("Dieta gerada e salva com sucesso:", response.data);
      setGeneratedDiet(response.data);
    } catch (error) {
      console.error("Erro ao gerar a dieta:", error);
      const errorMessage =
        error.response?.data?.message || "Ocorreu um erro ao gerar a dieta.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={generateMetricAndDiet} className="diet-form" action="">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Peso atual (kg)*:</label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="0"
                required
                placeholder="Ex: 70"
              />
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
                placeholder="Ex: 25"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Altura (cm)*:</label>
              <input
                type="number"
                id="height"
                name="height"
                min="0"
                required
                placeholder="Ex: 170"
              />
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
              <input
                type="text"
                id="foodAllergy"
                name="foodAllergy"
                placeholder="Ex: Glúten, Lactose, amendoim..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="conditions">
                Doenças ou condições (opcional):
              </label>
              <input
                type="text"
                id="diseasesOrConditions"
                name="diseasesOrConditions"
                placeholder="Ex: Diabetes, Hipertensão..."
              />
            </div>
          </div>
          <div className="container-generate-diet">
            <button type="submit" className="generate-diet-button">
              <Target className="target-icon" />
              Gerar Dieta
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="loading-text">
          <LoadingSpinner />
          <p className="loading-message">
            Gerando sua dieta personalizada, por favor aguarde...
          </p>
        </div>
      )}

      {generatedDiet && !isLoading && (
        <>
          <div className="diet-plan">
            <h2 className="diet-plan-title">Sua Dieta Personalizada 🍽️</h2>
            <div className="diet-goal-info">
              <p className="goal-user-info">
                Plano alimentar baseado no seu objetivo:
              </p>
              <p className="goal-user">
                {" "}
                {goals.find((goal) => goal.id === selectedGoal)?.name}
              </p>
            </div>
          </div>
          <div className="diet-section">
            <div className="diet-container">
              {Array.isArray(generatedDiet.dailyPlans) &&
                generatedDiet.dailyPlans.map((dayPlan) => (
                  <div className="diet-json" key={dayPlan.dayOfWeek}>
                    <p className="day">{dayPlan.dayOfWeek}</p>
                    {dayPlan.meals.map((meal) => (
                      <div className="meal-item">
                        <span className="hour">{meal.time}</span>
                        <span className="food-item">{meal.food}</span>
                        <div className="calories">
                          <span>{meal.calories} </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
