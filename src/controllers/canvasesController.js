import createHttpError from 'http-errors';
import { Canvas } from '../models/canvas.js';

export const getCanvases = async (req, res) => {
  // Отримуємо параметри пагінації
  const {
    page = 1,
    perPage = 10,
    title,
    year,
    tag,
    materials,
    search,
    sortBy = 'year',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);

  const skip = (pageNum - 1) * perPageNum;

  const filter = {};

  // Будую фільтр
  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }

  if (tag) {
    filter.tag = { $regex: tag, $options: 'i' };
  }

  if (materials) {
    filter.materials = { $regex: materials, $options: 'i' };
  }

  if (year) {
    filter.year = Number(year);
  }
  if (search) {
    // Текстовий пошук  (працює лише якщо створено текстовий індекс)
    // filter({ $text: { $search: search } }); //шукає тільки слова

    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { materials: { $regex: search, $options: 'i' } },
      { tag: { $regex: search, $options: 'i' } },
    ]; //знайди підрядок у полі
    //тоді text index не використовується
  }
  // $regex не використовує індекс. Це означає, що для великих колекцій такий пошук значно повільніший.

  // Пагінація + сортування
  const [totalItems, canvases] = await Promise.all([
    Canvas.countDocuments(filter),
    Canvas.find(filter)
      .skip(skip)
      .limit(perPageNum)
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
