import express from 'express';

import * as scheduleController from '../controllers/scheduleController';

const router = express.Router();

router.get('/:date', scheduleController.index);
router.get('/available/:date', scheduleController.showAvailables);
router.post('/', scheduleController.create);
router.delete('/:id', scheduleController.remove);

export default router;