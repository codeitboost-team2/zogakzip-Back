// src/routes/groupRoutes.js
import express from 'express';
import {
    registerGroup,
    listGroups,
    getGroupDetail,
    updateGroupDetail,
    deleteGroupById,
    verifyGroupPasswordHandler,
    likeGroupHandler,
    isGroupPublicHandler
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/', registerGroup);
router.get('/', listGroups);
router.get('/:groupId', getGroupDetail);
router.put('/:groupId', updateGroupDetail);
router.delete('/:groupId', deleteGroupById);
router.post('/:groupId/verify-password', verifyGroupPasswordHandler);
router.post('/:groupId/like', likeGroupHandler);
router.get('/:groupId/is-public', isGroupPublicHandler);

export default router;