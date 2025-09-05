import prisma from '../config/prisma.js';

class UsersRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createMetric(metricData) {
    const { userId, ...restOfMetrics } = metricData;
    return prisma.userMetric.create({
      data: {
        user: { connect: { id: userId } },
        ...restOfMetrics,
      },
    });
  }

}

export default new UsersRepository();