import { Joi, Segments } from 'celebrate';
import { ROLE } from '../constants/role.js';
import { objectIdValidator } from '../utils/objectIdValidator.js';

// GET запит на отримання усієї колекції

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    // додавання пагінації у запит get
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),

    // додати параметри для фільтрації можна відповідно до моделі
    // по кожному або по деяким!!!,
    role: Joi.string().valid(...ROLE),
    minAge: Joi.number().positive().integer(),
    maxAge: Joi.number().positive().integer(),

    // текстовий пошук для usernamee
    search: Joi.string().trim().min(3).max(30).allow(''),

    email: Joi.string().email().lowercase(),

    //  сортування
    sortBy: Joi.string()
      .valid('_id', 'username', 'age', 'email', 'createdAt', 'updatedAt')
      .default('username'),

    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    /*
     sortBy → поле для сортування (_id, name, age, .........);
     sortOrder → напрямок (asc або desc), за замовчуванням "asc".
    */
  }),
};

// валідація моделі usera
const bodySchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9 ]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': "Ім'я повинно бути рядком.",
      'string.empty': "Ім'я не може бути пустим.",
      'string.pattern.base': "Ім'я може містити тільки букви та цифри.",
      'string.min': "Ім'я повинно містити щонайменше {#limit} символів",
      'string.max': "Ім'я повинно містити щонайбільше {#limit} символів",
      'any.required': "Ім'я обов'язкове",
    }),
  email: Joi.string()
    .email()
    .messages({ 'any.required': "Пошта не обов'язкова" }),
  age: Joi.number().integer().min(12).max(95).required().messages({
    // 12 років - 95 років
    'number.base': 'Вік повинно бути числом',
    'number.min': 'щонайменше {#limit} символів',
    'number.max': 'щонайбільше {#limit} символів',
    'any.required': "обов'язкове поле",
  }),
  role: Joi.string()
    // .required()
    .valid(...ROLE)
    .messages({ 'any.only': 'Role - Задайте певне значення' }),
  password: Joi.string(),
  avatar: Joi.string(),
});

// для створення юзера -  визначаємо, яку саме частину HTTP-запиту ця схема має валідувати.
export const createUserSchema = { [Segments.BODY]: bodySchema };

// Схема для перевірки параметра userId
const userIdSchema = Joi.object({
  userId: Joi.string().custom(objectIdValidator).required(),
});

export const userIdParamSchema = {
  [Segments.PARAMS]: userIdSchema,
};

// оновлення юзера
// PATCH, перевіряємо id та поле оновлення, усі поля є необов`зковими, але хоча б одне повинно бути передано.

export const updateUserSchema = {
  [Segments.PARAMS]: userIdSchema,
  [Segments.BODY]: bodySchema.min(1), // важливо: не дозволяємо порожнє тіло
};
