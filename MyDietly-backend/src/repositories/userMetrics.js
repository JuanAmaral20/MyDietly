import prisma from '../config/prisma.js';

class UserMetricsRepository {
  async findLatestByUserId(userId) {
    return prisma.userMetric.findFirst({
      where: { userId: userId },
      orderBy: {
        registeredAt: 'desc',
      },
    });
  }
    async createMetric({ userId, goalId, ...restOfMetrics }) {
    return prisma.userMetric.create({
      data: {
        ...restOfMetrics,
        user: {
          connect: { id: userId },
        },
        goal: {
          connect: { id: goalId },
        },
      },
    });
  }
}

export default new UserMetricsRepository();