// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import canvasesRoutes from './routes/canvasesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import { errors } from 'celebrate';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // Логер першим — бачить усі запити
app.use(express.json()); // Middleware для парсингу JSON
// {  limit: '100kb'} // максимум 100 кілобайт
app.use(cors()); // Дозволяє запити з будь-яких джерел/доменів
app.use(helmet()); //  це для безпеки
app.use(cookieParser());

//--------------------------------------//

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Привіт !!!' });
});

// Маршрути
app.use(authRoutes);
app.use(canvasesRoutes);
app.use(usersRoutes);

app.use(notFoundHandler); // Middleware 404 (після всіх маршрутів)
app.use(errors()); // обробка помилок від celebrate (валідація)
app.use(errorHandler); // Middleware для обробки помилок

await connectMongoDB(); // підключення до MongoDB

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
