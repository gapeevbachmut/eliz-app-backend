import { Joi, Segments } from 'celebrate';
import { ROLE } from '../constants/role.js';

// валідація моделі usera
const bodySchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9 ]+$/)
    .min(3)
    .max(30)
    .messages({
      'string.base': "Ім'я повинно бути рядком.",
      'string.pattern.base': "Ім'я може містити тільки букви та цифри.",
      'string.min': "Ім'я повинно містити щонайменше {#limit} символів",
      'string.max': "Ім'я повинно містити щонайбільше {#limit} символів",
    }),
  email: Joi.string().email().required().messages({
    'string.base': 'Пошта повинна бути ...',
    'any.required': "Пошта обов'язкова",
  }),
  age: Joi.number().integer().min(12).max(100).messages({
    // 12 років - 95 років
    'number.base': 'Вік повинно бути числом',
    'number.min': 'щонайменше {#limit} років',
    'number.max': 'щонайбільше {#limit} років',
  }),
  role: Joi.string()
    .default('guest')
    .valid(...ROLE),
  password: Joi.string().min(8).max(30).required().messages({
    'any.required': 'password is REQUIRED',
  }),
  avatar: Joi.string(),
});

// для створення юзера -  визначаємо, яку саме частину HTTP-запиту ця схема має валідувати.

export const registerUserSchema = { [Segments.BODY]: bodySchema };

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
