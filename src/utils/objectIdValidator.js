import { isValidObjectId } from 'mongoose';

// Кастомний валідатор для ObjectId  -  id бази даних

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
