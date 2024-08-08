import express from 'express';
import * as reviewController from '../controllers/reviewController';

const router = express.Router();

router.post('/', reviewController.create)
router.get('/professional/:id', reviewController.getByProfessional)
router.get('/user/:id', reviewController.getByUser)

export default router;