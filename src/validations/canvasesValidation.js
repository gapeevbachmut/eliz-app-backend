import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/TAGS.js';
import { MATERIALS } from '../constants/materials.js';
import { objectIdValidator } from '../utils/objectIdValidator.js';

// GET запит на отримання усієї колекції

export const getCanvasesSchema = {
  [Segments.QUERY]: Joi.object({
    // додавання пагінації у запит get
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),

    // додати параметри для фільтрації можна відповідно до моделі
    // по кожному або по деяким!!!,
    // title: Joi.string(),
    year: Joi.number().integer(),
    materials: Joi.string().valid(...MATERIALS),
    // tag: Joi.string().valid(...TAGS),

    // текстовий пошук для title, tag
    search: Joi.string().trim().min(2).max(30).allow(''),

    //  сортування
    sortBy: Joi.string()
      .valid(
        '_id',
        'title',
        'year',
        'materials',
        'tag',
        'createdAt',
        'updatedAt',
      )
      .default('year'),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const bodySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[\p{L}0-9 ]+$/u)
    //     .pattern(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9 ]+$/)

    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Назва повинна бути рядком.',
      'string.empty': 'Назва не може бути пустою.',
      'string.pattern.base': 'Назва може містити будь-які символи.',
      'string.min': 'Назва повинна містити щонайменше {#limit} символів',
      'string.max': 'Назва повинна містити щонайбільше {#limit} символів',
      'any.required': "Назва обов'язкове поле",
    }),
  year: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.base': 'Повинно бити число',
      'number.min': 'щонайменше {#limit} символів',
      'number.max': 'щонайбільше {#limit} символів',
      'any.required': "обов'язкове поле",
    }),
  materials: Joi.string()
    .min(3)
    .max(30)
    .required()
    .valid(...MATERIALS)
    .messages({
      'string.base': 'Назва повинна бути рядком.',
      'string.min': 'Назва повинна містити щонайменше {#limit} символів',
      'string.max': 'Назва повинна містити щонайбільше {#limit} символів',
      'any.required': "обов'язкове поле",
    }),
  tag: Joi.string().valid(...TAGS),
  imageUrl: Joi.string().required().messages({
    'string.base': 'Назва повинна бути рядком.',
    'any.required': "обов'язкове поле",
  }),
});

export const createCanvasSchema = {
  [Segments.BODY]: bodySchema,
}; /*Segments.BODY → тіло запиту (req.body);*/

// Схема для перевірки параметра canvasId
export const canvasIdSchema = Joi.object({
  canvasId: Joi.string().custom(objectIdValidator).required(),
});

export const canvasIdParamSchema = { [Segments.PARAMS]: canvasIdSchema };

// оновлення
// PATCH, перевіряємо id та поле оновлення, усі поля є необов`зковими, але хоча б одне повинно бути передано.

export const updateCanvasSchema = {
  [Segments.PARAMS]: canvasIdSchema,
  [Segments.BODY]: bodySchema.min(1), // важливо: не дозволяємо порожнє тіло
};
