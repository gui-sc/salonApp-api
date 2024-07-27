import express from 'express';
import * as professionalController from '../controllers/professionalController';

const router = express.Router();

router.post('/login', professionalController.login);
router.post('/', professionalController.create);
router.get('/', professionalController.getAll);
router.get('/:id', professionalController.getOne);
router.put('/:id', professionalController.update);
router.delete('/:id', professionalController.deleteProfessional);

export default router;