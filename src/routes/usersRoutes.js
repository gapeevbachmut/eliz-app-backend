import { Router } from 'express';
import {
  // createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import {
  getUsersSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../validations/usersValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// 2. Додаємо middleware до всіх шляхів, що починаються з /users
router.use('/users', authenticate);

router.get('/users', authenticate, celebrate(getUsersSchema), getUsers);
router.get(
  '/users/:userId',
  authenticate,
  celebrate(userIdParamSchema),
  getUserById,
);
router.delete(
  '/users/:userId',
  authenticate,
  celebrate(userIdParamSchema),
  deleteUser,
);
router.patch(
  '/users/:userId',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

export default router;
