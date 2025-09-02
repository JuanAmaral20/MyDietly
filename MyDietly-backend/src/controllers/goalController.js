import GoalService from '../services/goalService.js';
class GoalController {
  async findAll(req, res) {
    try {
      const goals = await GoalService.findAll();
      return res.status(200).json(goals);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching goals' });
    }
  }
}
export default new GoalController();