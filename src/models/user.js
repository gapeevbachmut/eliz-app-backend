// src/models/user.js

import { model, Schema } from 'mongoose';
import { ROLE } from '../constants/role.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      enum: ROLE,
    },
    avatar: { type: String, required: false, trim: true },
    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false },
);

//   //  якщо username — необов`язкове поле.
//   // За замовчуванням воно дорівнює email користувача
// userSchema.pre('save', function () {
//   if (!this.username) {
//     this.username = this.email;
//   }
//   // next();
// });

//  Видалення паролю з відповіді
// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// текстові індекси:

// Унікальний email тільки для документів,
// у яких email присутній
// userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
// Індекс для фільтрації за віком
// userSchema.index({ age: 1 });
/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

// Додаємо текстовий індекс: кажемо MongoDB, що по полю username можна робити $text
// userSchema.index(
//   { username: 'text' },
//   // цей індекс зараз не використовується -  я використовую $regex
//   // додаткові налаштування
//   {
//     name: 'UserTextIndex', // назва індексу в базі даних
//     weights: { username: 10 }, // пріоритет
//     default_language: 'none', //'english'
//   },
// );

export const User = model('User', userSchema);
