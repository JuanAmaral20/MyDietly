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
        <Link to="/login" className="secondary-button">
           <div className="button-content">
            <span>Já tenho uma conta</span>
          </div>
        </Link>
      </div>
      <Cards />
      </div>
    </div>
  );
};

export default Home;
