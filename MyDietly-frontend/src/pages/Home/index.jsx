import React from "react";
import "./index.css";
import { HeartHandshake, Target } from "lucide-react";
import Cards from "../../components/cardsHome";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="gradient-background-blue-green">
      <div className="container-general">
        
      <div className="main-container">
        <div className="welcome-mydietly">
          <HeartHandshake className="heart-icon" />
          <h1 className="mydietly-title">MyDietly</h1>
        </div>
        <p className="welcome-message">
          Sua jornada para uma vida mais saudável começa <br /> aqui
        </p>
        <p className="description">
          Crie dietas personalizadas baseadas nos seus objetivos, idade e peso.{" "}
          <br />
          Transforme seus hábitos alimentares de forma inteligente e eficaz.
        </p>
      </div>
      <div className="button-container">
        <Link to="/register" className="primary-button">
          <div className="button-content">
            <Target />
            <span>Começar Agora</span>
          </div>
        </Link>
        <button className="secondary-button">Já tenho uma conta</button>
      </div>
      <Cards />
      {/* <div className="cards-container">
        <div className="card-item">
          <div className="card-header">
            <Target className="card-icon" />
            <h3>Objetivos Personalizados</h3>
          </div>
          <div className="card-description">
            <p>
              Dietas específicas para perder peso, ganhar massa ou manter a forma
            </p>
          </div>
        </div>
        <div className="card-item">
          <div className="card-header">
            <Zap className="card-icon" />
            <h3>Resultados Rápidos</h3>
          </div>
          <div className="card-description">
            <p>
              Gere sua dieta personalizada em segundos baseada nas suas
              informações
            </p>
          </div>
        </div>
        <div className="card-item">
          <div className="card-header">
            <Users className="card-icon" />
            <h3>Fácil de Usar</h3>
          </div>
          <div className="card-description">
            <p>Interface simples e intuitiva para todos os níveis de usuário</p>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default Home;
