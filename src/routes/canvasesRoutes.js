import { Router } from 'express';
import {
  createCanvas,
  deleteCanvas,
  getCanvasById,
  getCanvases,
  updateCanvas,
} from '../controllers/canvasesController.js';
import { celebrate } from 'celebrate';
import {
  canvasIdParamSchema,
  createCanvasSchema,
  getCanvasesSchema,
  updateCanvasSchema,
} from '../validations/canvasesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/canvases', celebrate(getCanvasesSchema), getCanvases);
router.get(
  '/canvases/:canvasId',
  authenticate,
  celebrate(canvasIdParamSchema),
  getCanvasById,
);
router.post(
  '/canvases',
  authenticate,
  celebrate(createCanvasSchema),
  createCanvas,
);
router.delete(
  '/canvases/:canvasId',
  authenticate,
  celebrate(canvasIdParamSchema),
  deleteCanvas,
);
router.patch(
  '/canvases/:canvasId',
  authenticate,
  celebrate(updateCanvasSchema),
  updateCanvas,
);

export default router;
