import GoalRepository from '../repositories/goalRepository.js';
class GoalService {
  async findAll() {
    return GoalRepository.findAll();
  }
}
export default new GoalService();