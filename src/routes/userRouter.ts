import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/login', userController.login);
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id/activate', userController.activate);
router.put('/:id', userController.update);
router.delete('/:id', userController.inactivate);
router.delete('/:id/delete', userController.remove);

export default router;