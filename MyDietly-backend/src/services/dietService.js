import DietRepository from '../repositories/dietRepository.js';
import UsersRepository from '../repositories/UsersRepository.js';

class DietService {
    async createDiet(userId, dietData) {
        const user = await UsersRepository.findById(userId);
        if (!user) throw new Error('User not found');

        return DietRepository.createDiet({
            ...dietData,
            userId: user.id,
        });
    }

    async createDietDetails(userId, dietId, dietDetails) {
        const user = await UsersRepository.findById(userId);
        if (!user) throw new Error('User not found');

        const diet = await DietRepository.findDietById(dietId);
        if (!diet) throw new Error('Diet not found');

        if (diet.userId !== user.id) {
            throw new Error('You do not have permission to modify this diet');
        }

        const updatedDiet = await DietRepository.createDietDetail({
            ...dietDetails,
            dietId: diet.id,
        });

        return updatedDiet;
    }

    async getDietById(dietId) {
        const diet = await DietRepository.findDietById(dietId);
        if (!diet) throw new Error('Diet not found');

        return diet;
    }

    async getDietDetails(userId, dietId) {
        const diet = await DietRepository.findDietById(dietId);
        if (!diet) throw new Error('Diet not found');

        if (diet.userId !== userId) {
            throw new Error('You do not have permission to view this diet');
        }

        return diet.details;
    }

    async findUserDiet(userId) {
        const dietFromDb = await DietRepository.findLatestByUserId(userId);
        if (!dietFromDb) throw new Error('No diet found for this user');

        const dailyPlans = this.groupMealsByDay(dietFromDb.details);

        const formattedDiet = {
            dietName: dietFromDb.name,
            summary: dietFromDb.summary,
            dailyPlans: dailyPlans,
            id: dietFromDb.id,
            generatedAt: dietFromDb.generatedAt
        };

        return formattedDiet;
    }

    groupMealsByDay(details) {
        if (!Array.isArray(details)) return [];


        const daysMap = details.reduce((acc, meal) => {
            const day = meal.dayOfWeek;
            if (!acc[day]) {
                acc[day] = {
                    dayOfWeek: day,
                    meals: [],

                };
            }
            acc[day].meals.push({ time: meal.time, food: meal.food, calories: meal.calories });
            return acc;
        }, {});

        const weekOrder = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
        return weekOrder.map(day => daysMap[day]).filter(Boolean);
    }

    async findDietById(dietId, userId) {
        const diet = await DietRepository.findDietById(dietId);
        if (!diet) throw new Error('Diet not found');

        if (diet.userId !== userId) {
            throw new Error('You do not have permission to view this diet');
        }

        return diet;
    }
}

export default new DietService();