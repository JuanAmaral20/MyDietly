import prisma from '../config/prisma.js';

class DietRepository {
  async createDiet(dietData) {
    return prisma.diet.create({
      data: dietData,
    });
  }

  async findDietById(id) {
    return prisma.diet.findUnique({
      where: { id },
      include: { details: true },
    });
  }

  async updateDiet(id, dietData) {
    return prisma.diet.update({
      where: { id },
      data: dietData,
    });
  }

  async findLatestByUserId(userId) {
    return prisma.diet.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      include: { details: true },
    });
  }

  async deleteDiet(id) {
    return prisma.diet.delete({
      where: { id },
    });
  }

  async createDietDetail({ dietId, dayOfWeek, time, food }) {
    return prisma.dietDetail.create({
      data: {
        dayOfWeek,
        time,
        food,
        diet: { connect: { id: dietId } }
      },
    });
  }

  async createDietWithDetails(dietData) {
    const { userId, name, summary, dailyPlans } = dietData;

    return prisma.diet.create({
      data: {
        name,
        summary,
        user: {
          connect: { id: userId },
        },
        details: {
          create: dailyPlans.flatMap(plan =>
            plan.meals.map(meal => ({
              dayOfWeek: plan.dayOfWeek,
              time: meal.time,
              food: meal.food,
            }))
          ),
        },
      },
      include: {
        details: true,
      },
    });
  }
}

export default new DietRepository();