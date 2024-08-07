import express from 'express';
import * as professionalServiceController from '../controllers/professionalServiceController';
const router = express.Router();

router.post('/', professionalServiceController.create)
router.get('/professional/:id', professionalServiceController.getByProfessional)
router.get('/service/:id', professionalServiceController.getByService)
router.delete('/:id', professionalServiceController.remove)

export default router;
