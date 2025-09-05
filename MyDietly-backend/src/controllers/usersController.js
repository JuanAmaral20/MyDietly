import UsersService from '../services/usersService.js';

class UsersController {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await UsersService.create({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {

      if (error.message === 'E-mail já cadastrado.') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UsersService.login({ email, password });
      return res.status(200).json(user);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ message: error.message });
      }
      console.error('Login Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createMetrics(req, res) {
    const { weight, height, age, goal, activityLevel, foodAllergy = null, diseasesOrConditions = null } = req.body;
    const userId = req.userId;

    try {
      const userMetric = await UsersService.createMetric({
        userId,
        weight,
        height,
        age,
        goal,
        activityLevel,
        foodAllergy,
        diseasesOrConditions,
      });
      return res.status(201).json(userMetric);
    } catch (error) {
      console.error('Error creating user metric:', error);
      return res.status(500).json({ message: 'Error creating user metric' });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const userId = req.userId;
      const user = await UsersService.findUserById(userId);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default new UsersController();