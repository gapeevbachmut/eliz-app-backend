// src/models/canvas.js

import { model, Schema } from 'mongoose';
import { MATERIALS } from '../constants/materials.js';
import { TAGS } from '../constants/TAGS.js';

const canvasSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    //  trim: true, // прибирає пробіли на початку та в кінці
    year: { type: Number, required: false },
    materials: {
      type: String,
      required: true,
      enum: MATERIALS, // перелік допустимих значень
    },
    tag: { type: String, required: false, enum: TAGS },
    imageUrl: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
/*
default — значення за замовчуванням, якщо поле не передано.

timestamps — автоматично додає createdAt і updatedAt.
*/

// Додаємо текстовий індекс: кажемо MongoDB, що по полю title можна робити $text
canvasSchema.index(
  { title: 'text' },
  // додаткові налаштування
  {
    name: 'CanvasTextIndex', // назва індексу в базі даних
    weights: { title: 10 }, // пріоритет
    default_language: 'none',
  },
);

export const Canvas = model('Canvas', canvasSchema, 'canvases');
// 'canvases' - вказав конкретну колекцію !!!
