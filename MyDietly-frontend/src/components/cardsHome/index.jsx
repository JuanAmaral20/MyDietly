import { Target, Users, Zap } from "lucide-react";
import "./index.css";

const Cards = () => {
    return (
      <div className="cards-container">
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
      </div>
    );
}

export default Cards;