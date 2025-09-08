import DietService from '../services/dietService.js';

class DietController {
    async createDiet(req, res) {
        try {
            const userId = req.userId;
            const dietData = req.body;

            const diet = await DietService.createDiet(userId, dietData);
            return res.status(201).json(diet);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async createDietDetails(req, res) {
        try {
            const userId = req.userId;
            const { dietId } = req.params;

            const dietDetails = req.body;

            const newDetail = await DietService.createDietDetails(userId, dietId, dietDetails);

            return res.status(201).json(newDetail);
        } catch (error) {
            if (error.message.includes('permission')) {
                return res.status(403).json({ message: error.message });
            }
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }

    async getDietById(req, res) {
        try {
            const { dietId } = req.params;
            const { userId } = req;
            const diet = await DietService.findDietById(dietId, userId);
            if (!diet) {
                return res.status(404).json({ message: 'Diet not found' });
            }
            return res.status(200).json(diet);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getDietDetails(req, res) {
        try {
            const { dietId } = req.params;
            const { userId } = req;
            const details = await DietService.getDietDetails(userId, dietId);

            return res.status(200).json(details);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getCurrentUserDiet(req, res) {
        try {
            const { userId } = req;
            const diet = await DietService.findUserDiet(userId);
            return res.status(200).json(diet);
        } catch (error) {
            if (error.message.includes('No diet found')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new DietController();