import { GoogleGenerativeAI } from '@google/generative-ai';
import UsersRepository from '../repositories/UsersRepository.js';
import UserMetricsRepository from '../repositories/userMetrics.js';
import dietRepository from '../repositories/dietRepository.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
    async generateAndSaveDiet(userId) {

        const user = await UsersRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const metrics = await UserMetricsRepository.findLatestByUserId(userId);
        if (!metrics) {
            throw new Error('Metrics not found for this user');
        }

        const promptTemplate = `
      # MISSÃO
Você é um nutricionista virtual especialista, chamado 'NutriAI'. Sua missão é criar planos alimentares detalhados, saudáveis e personalizados.

# CONTEXTO DO USUÁRIO
Você deve criar um plano para um indivíduo com as seguintes características:
- **Nome:** {userName}
- **Idade:** {age} anos
- **Peso:** {weight} kg
- **Altura:** {height} cm
- **Objetivo Principal:** {goal} (Ex: Perder peso, Ganhar massa muscular, Manter o peso)
- **Nível de Atividade Física:** {activityLevel} (Ex: Sedentário, Levemente ativo, Moderadamente ativo, Muito ativo)
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
        { "time": "08:00", "food": "Descrição detalhada da refeição e quantidades." },
        { "time": "10:30", "food": "Descrição detalhada da refeição e quantidades." },
        { "time": "13:00", "food": "Descrição detalhada da refeição e quantidades." },
        { "time": "16:00", "food": "Descrição detalhada da refeição e quantidades." },
        { "time": "19:30", "food": "Descrição detalhada da refeição e quantidades." }
      ],
      "dailySummary": {
        "calories": "Estimativa de calorias totais para o dia (ex: 2200 kcal)",
        "protein": "Estimativa de proteínas totais para o dia (ex: 150g)"
      }
    },
    {
      "dayOfWeek": "Terça-feira",
      "meals": [ ... ],
      "dailySummary": { ... }
    }
  ]
}`;

        const prompt = promptTemplate
            .replace('{userName}', user.name)
            .replace('{age}', metrics.age)
            .replace('{weight}', metrics.weight)
            .replace('{height}', metrics.height) 
            .replace('{goal}', metrics.goal)
            .replace('{activityLevel}', metrics.activityLevel) 
            .replace('{foodAllergy}', metrics.foodAllergy || 'Nenhuma') 
            .replace('{diseasesOrConditions}', metrics.diseasesOrConditions || 'Nenhuma'); 

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let responseText = response.text();
            if (responseText.startsWith("```json")) {
                console.log("Resposta da IA veio com Markdown. Limpando...");
                responseText = responseText.replace("```json", "").replace(/```$/, "");
            }
            console.log("Resposta crua (e limpa) da IA:", responseText);
            const planJson = JSON.parse(responseText);
                        
            const savedDiet = await dietRepository.createDietWithDetails({
                userId,
                name: planJson.dietName,
                summary: planJson.summary,
                dailyPlans: planJson.dailyPlans,
            });
            
            return savedDiet;
            
        } catch (error) {
            console.error("Erro na API do Gemini:", error);
            throw new Error("Falha ao gerar dica com a IA.");
        }
    }
}

export default new GeminiService();