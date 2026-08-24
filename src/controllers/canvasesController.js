import createHttpError from 'http-errors';
import { Canvas } from '../models/canvas.js';

export const getCanvases = async (req, res) => {
  // вказую параметри пагінації
  const {
    page = 1,
    perPage = 10,

    //додаю параметри для фільтрації
    year,
    materials,

    //параметри для пошуку - title + tag
    search,

    // сортування - вказуємо параметри
    // дефолтне сортування за year
    sortBy = 'year',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);

  const skip = (pageNum - 1) * perPageNum;

  // базовий запит до колекції

  const canvasQuery = Canvas.find();

  // Будую фільтр
  if (materials) {
    canvasQuery.where({ materials: { $regex: materials, $options: 'i' } });
  }

  if (year) {
    (await canvasQuery.where('year')).length(year);
  }

  // Пошук по частині
  if (search) {
    canvasQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
        { materials: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // $regex не використовує індекс. Це означає, що для великих колекцій такий пошук значно повільніший.

  // Пагінація + сортування
  const [totalItems, canvases] = await Promise.all([
    canvasQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.

    canvasQuery
      .skip(skip)
      .limit(perPageNum)
      // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.

      // Додамєдо сортування в ланцюжок методів квері
      .sort({ [sortBy]: sortOrder }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPageNum);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    canvases,
  });
};

export const getCanvasById = async (req, res) => {
  const { canvasId } = req.params;
  const canvas = await Canvas.findById(canvasId);

  if (!canvas) {
    throw createHttpError(404, 'Зображення не знайдене!!!');
  }

  res.status(200).json(canvas);
};

export const createCanvas = async (req, res) => {
  const canvas = await Canvas.create(req.body);

  // res.status(201).json({ message: 'Зображення створено!!!', canvas });
  res.status(201).json(canvas);
};

export const deleteCanvas = async (req, res) => {
  const { canvasId } = req.params;
  const canvas = await Canvas.findOneAndDelete({ _id: canvasId });

  if (!canvas) {
    throw createHttpError(404, 'Зображення не знайдене!!!');
  }

  res.status(200).json(canvas);
};

export const updateCanvas = async (req, res) => {
  const { canvasId } = req.params;
  const canvas = await Canvas.findOneAndUpdate({ _id: canvasId }, req.body, {
    // returnDocument: 'after',
    new: true,
  });

  if (!canvas) {
    throw createHttpError(404, 'Зображення не знайдене!!!');
  }

  res.status(200).json(canvas);
};
