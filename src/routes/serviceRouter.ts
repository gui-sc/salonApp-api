import express from 'express';
import * as serviceController from '../controllers/serviceController';
const router = express.Router();

router.post('/', serviceController.create)
router.get('/', serviceController.list)
router.get('/:id', serviceController.get)
router.put('/:id', serviceController.update)
router.delete('/:id', serviceController.remove)

export default router;