import express from 'express';
import * as platingsController from '../controllers/platingsController.js';

const router = express.Router();

router
.route("/")
.get(platingsController.getPlatings)
.post(platingsController.createPlating);

export default router;