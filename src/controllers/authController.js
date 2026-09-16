import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { username, email, password, age, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Така пошта вже використовується!');
  }
  //   спочатку шукаємо користувача з таким email.
  // Якщо він існує → повертаємо помилку 400 Bad Request з повідомленням Email in use.
  // Якщо ні →  створюємо користувача

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створюємо користувача

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    age,
    avatar,
  });

  res.status(201).json({ newUser });
};

// Контролер логіну
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Перевіряємо чи користувач з такою поштою існує
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Недійсні облікові дані');
  }

  // Порівнюємо хеші паролів
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, 'Недійсні облікові дані');
  }
  res.status(200).json(user);
};
