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

const router = Router();

router.get('/canvases', celebrate(getCanvasesSchema), getCanvases);
router.get(
  '/canvases/:canvasId',
  celebrate(canvasIdParamSchema),
  getCanvasById,
);
router.post('/canvases', celebrate(createCanvasSchema), createCanvas);
router.delete(
  '/canvases/:canvasId',
  celebrate(canvasIdParamSchema),
  deleteCanvas,
);
router.patch(
  '/canvases/:canvasId',
  celebrate(updateCanvasSchema),
  updateCanvas,
);

export default router;
