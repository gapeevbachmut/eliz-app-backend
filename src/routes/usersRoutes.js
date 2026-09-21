import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import {
  createUserSchema,
  getUsersSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../validations/usersValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// 2. Додаємо middleware до всіх шляхів, що починаються з /users
router.use('/users', authenticate);

router.get('/users', celebrate(getUsersSchema), getUsers);
router.get('/users/:userId', celebrate(userIdParamSchema), getUserById);
router.post('/users', celebrate(createUserSchema), createUser);
router.delete('/users/:userId', celebrate(userIdParamSchema), deleteUser);
router.patch('/users/:userId', celebrate(updateUserSchema), updateUser);

export default router;
