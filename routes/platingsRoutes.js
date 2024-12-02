import express from 'express';
import * as platingsController from '../controllers/platingsController.js';

const router = express.Router();

router
  .route("/gallery")
  .get(platingsController.getPlatings)
  .post(platingsController.createPlating);

router
  .route("/gallery/:id")
  .get(platingsController.getPlatingById);

router
  .route("/save-image")
  .post(platingsController.saveImageToGallery);

export default router;