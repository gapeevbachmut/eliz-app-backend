import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/TAGS.js';
import { MATERIALS } from '../constants/materials.js';

const bodySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[\p{L}0-9 ]+$/u)
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

// Кастомний валідатор для ObjectId  -  id бази даних
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра canvasId
export const canvasIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    /*Segments.PARAMS → параметри маршруту (req.params); */
    canvasId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// PATCH, перевіряємо id та поле оновлення, усі поля є необов`зковими, але хоча б одне повинно бути передано.

export const updateCanvasSchema = {
  [Segments.PARAMS]: Joi.object({
    canvasId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: bodySchema.min(1), // важливо: не дозволяємо порожнє тіло
};

//  Валідація параметрів запиту     -    пагінація

export const getCanvasesSchema = {
  [Segments.QUERY]: Joi.object({
    /*Segments.QUERY → рядок запиту (req.query); */
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),

    // bodySchema /* або додати тільки те що фільтруємо ? */,

    title: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[\p{L}0-9 ]+$/u)
      .messages({
        'string.pattern.base':
          'Назва може містити тільки букви, цифри та пробіли',
      }),
    year: Joi.number().integer().min(1000).max(new Date().getFullYear()),
    materials: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .valid(...MATERIALS),
    tag: Joi.string().valid(...TAGS),

    search: Joi.string().trim().min(2).max(50).allow(''),

    //  сортування
    sortBy: Joi.string()
      .valid('_id', 'title', 'year', 'materials', 'tag', 'createdAt')
      .default('year'),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};
