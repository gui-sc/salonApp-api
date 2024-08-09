import express from 'express';

import * as scheduleController from '../controllers/scheduleController';

const router = express.Router();

router.get('/professional/:date/:professionalId', scheduleController.getByProfessional);
router.get('/user/:date/:userId', scheduleController.getByUser);
router.get('/available/:date/:professionalId', scheduleController.showAvailables);
router.post('/', scheduleController.create);
router.delete('/:id', scheduleController.remove);

export default router;