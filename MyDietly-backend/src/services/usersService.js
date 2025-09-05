import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/UsersRepository.js';

class UsersService {
  async create({ name, email, password }) {
    const existingUser = await UsersRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UsersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ email, password }) {
    const user = await UsersRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const payload = { userId: user.id };

    console.log("CRIANDO token com a chave:", process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }

  async createMetric({ userId, weight, height, activityLevel, foodAllergy = null, diseasesOrConditions = null, age, goal }) {
    const user = await UsersRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userMetric = await UsersRepository.createMetric({
      userId,
      weight,
      height,
      activityLevel,
      foodAllergy,
      diseasesOrConditions,
      age,
      goal,
    });

    return userMetric;
  }

  async findUserById(userId) {
    const user = await UsersRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UsersService();