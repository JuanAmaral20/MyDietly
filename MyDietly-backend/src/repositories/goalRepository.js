import prisma from '../config/prisma.js';
class GoalRepository {
  async findAll() {
    return prisma.goal.findMany();
  }
}
export default new GoalRepository();