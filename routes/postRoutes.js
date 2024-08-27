import express from 'express';
import {
    registerPost,
    updatePost,
    deletePost,
    getPostsList,
    getPostDetail,
    verifyPostPassword,
    likePost,
    isGroupPublicHandler,
} from '../controllers/postController.js';

const router = express.Router({ mergeParams: true });
router.post('/', registerPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.get('/', getPostsList);
router.get('/:postId', getPostDetail);
router.post('/:postId/verify-password', verifyPostPassword);
router.post('/:postId/like', likePost);
router.get('/:postId/is-public', isGroupPublicHandler);

export default router;