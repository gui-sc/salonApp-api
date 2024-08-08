import express from 'express';
import * as reviewController from '../controllers/reviewController';

const router = express.Router();

router.post('/', reviewController.create)

export default router;