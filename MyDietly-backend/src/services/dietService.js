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
        const diet = await DietRepository.findLatestByUserId(userId);
        if (!diet) throw new Error('No diet found for this user');
        return diet;
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