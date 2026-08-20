import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUsers = async (req, res) => {
  const {
    // вказую параметри пагінації

    page = 1,
    perPage = 10,

    //параметри для пошуку
    search,

    //додаю параметри для фільтрації
    minAge,
    maxAge,
    role,

    // сортування - вказуємо параметри
    // дефолтне сортування за name
    sortBy = 'username',
    sortOrder = 'asc',
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);

  const skip = (pageNum - 1) * perPageNum;

  // базовий запит до колекції
  const usersQuery = User.find();

  // Пошук по частині імені
  if (search) {
    usersQuery.where(
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    );
  }

  // Будую фільтр
  if (minAge) {
    usersQuery.where('age').gte(minAge);
    // більше або дорівнює
  }

  if (maxAge) {
    usersQuery.where('age').lte(maxAge);
    // менше або дорівнює
  }

  if (role) {
    usersQuery.where('role').equals(role);
  }

  //виконуємо два запити паралельно
  // тут вказуємо параметри для пагінації + сортування

  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    usersQuery
      .skip(skip)
      .limit(perPageNum)
      // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.
      // Додаємо сортування в ланцюжок методів квері
      .sort({ [sortBy]: sortOrder }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPageNum);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    users,
  });
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, 'Користувач не знайдений!!!');
  }

  res.status(200).json(user);
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json(user);
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    throw createHttpError(404, 'Користувач не знайдений!!');
  }

  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    // Шукаємо по id
    req.body,
    {
      returnDocument: 'after',
      // or:  new: true,
    }, // повертаємо оновлений документ
  );

  if (!user) {
    throw createHttpError(404, 'Користувач не знайдений!!');
  }

  res.status(200).json(user);
};
