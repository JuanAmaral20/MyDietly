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
}

export default new UserMetricsRepository();