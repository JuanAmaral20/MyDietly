import { GoogleGenerativeAI } from '@google/generative-ai';
import UsersRepository from '../repositories/UsersRepository.js';
import UserMetricsRepository from '../repositories/userMetrics.js'; 
import DietRepository from '../repositories/dietRepository.js';
import prisma from '../config/prisma.js'; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {

  async createMetricsAndGenerateDiet(userId, metricData) {
    
    
    console.log("Salvando métricas do usuário...");
    await UserMetricsRepository.createMetric({ userId, ...metricData });
    console.log("Métricas salvas com sucesso.");

   
    const user = await UsersRepository.findById(userId);
    const metrics = await UserMetricsRepository.findLatestByUserId(userId); 
    const goal = await prisma.goal.findUnique({ where: { id: metrics.goalId } });

    if (!user || !metrics || !goal) {
      throw new Error('Não foi possível encontrar todos os dados necessários para gerar a dieta.');
    }

    const promptTemplate = 
    ` # MISSÃO
      Você é um nutricionista virtual especialista, chamado 'NutriAI'. Sua missão é criar planos alimentares detalhados, saudáveis e personalizados.

      # CONTEXTO DO USUÁRIO
      Você deve criar um plano para um indivíduo com as seguintes características:
      - **Nome:** {userName}
      - **Idade:** {age} anos
      - **Peso:** {weight} kg
      - **Altura:** {height} cm
      - **Objetivo Principal:** {goal}
      - **Nível de Atividade Física:** {activityLevel}
      - **Alergias Alimentares:** {allergies}
      - **Condições de Saúde/Doenças:** {diseases}

      # TAREFA
      Sua tarefa é gerar um plano alimentar completo de 7 dias (de Segunda-feira a Domingo) com base no contexto do usuário.

      # REGRAS E CONSTRAÇÕES
      1. O plano deve ser estritamente alinhado com o objetivo do usuário.
      2. Leve em consideração todas as alergias e condições de saúde listadas, evitando completamente os alimentos problemáticos.
      3. Crie 5 refeições por dia: Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde e Jantar.
      4. Para cada refeição, especifique os alimentos e as quantidades aproximadas.
      5. A resposta DEVE SER ESTRITAMENTE um objeto JSON válido, sem nenhum texto ou explicação adicional antes ou depois do JSON. Não inclua a formatação json do Markdown.

      # ESTRUTURA DO JSON DE SAÍDA
      O JSON deve seguir exatamente esta estrutura:
      {
        "dietName": "Plano Personalizado para {userName}",
        "summary": "Um resumo motivacional de 2 frases sobre o plano e o objetivo.",
        "dailyPlans": [
          {
            "dayOfWeek": "Segunda-feira",
            "meals": [
              { "time": "08:00", "food": "Descrição detalhada da refeição e quantidades.", calories: "Estimativa de calorias (ex: 400kcal)" },
              { "time": "10:30", "food": "Descrição detalhada da refeição e quantidades.", calories: "Estimativa de calorias (ex: 200kcal)" },
              { "time": "13:00", "food": "Descrição detalhada da refeição e quantidades.", calories: "Estimativa de calorias (ex: 600kcal)" },
              { "time": "16:00", "food": "Descrição detalhada da refeição e quantidades.", calories: "Estimativa de calorias (ex: 300kcal)" },
              { "time": "19:30", "food": "Descrição detalhada da refeição e quantidades.", calories: "Estimativa de calorias (ex: 500kcal)" }
            ],
            "dailySummary": {
              "calories": "Estimativa de calorias do alimento que será ingerido no horário específico (ex: 2200 kcal)",
              "protein": "Estimativa de proteínas totais para o dia (ex: 150g)"
            }
          }
        ]
      }`;

    const prompt = promptTemplate
        .replace(/{userName}/g, user.name)
        .replace('{age}', metrics.age)
        .replace('{weight}', metrics.weight)
        .replace('{height}', metrics.height)
        .replace('{goal}', goal.name) 
        .replace('{activityLevel}', metrics.activityLevel)
        .replace('{allergies}', metrics.foodAllergy || 'Nenhuma')
        .replace('{diseases}', metrics.diseasesOrConditions || 'Nenhuma');

    try {
      console.log("Gerando dieta com a IA...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      if (responseText.startsWith("```json")) {
        responseText = responseText.replace("```json", "").replace(/```$/, "");
      }
      const planJson = JSON.parse(responseText);

      console.log("Salvando a dieta gerada...");
      await DietRepository.createDietWithDetails({
          userId,
          name: planJson.dietName,
          summary: planJson.summary,
          dailyPlans: planJson.dailyPlans,
      });
      
      return planJson;
      
    } catch (error) {
        console.error("Erro na API do Gemini ou no parse do JSON:", error);
        throw new Error("Falha ao gerar e salvar a dieta com a IA.");
    }
  }
}

export default new GeminiService();