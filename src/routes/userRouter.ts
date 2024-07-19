import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/login', userController.login);
router.post('/', userController.create);
router.get('/', userController.getAll);

export default router;