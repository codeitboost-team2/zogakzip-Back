// src/routes/postRoutes.js
import express from 'express';
import {
    registerPost,
    listPosts,
    getPostDetail,
    updatePostDetail,
    deletePostById,
    verifyPostPasswordHandler,
    likePostHandler,
    getPostVisibility,
} from '../controllers/postController.js';

const router = express.Router({ mergeParams: true });

router.post('/', registerPost);
router.get('/', listPosts);
router.get('/:postId', getPostDetail);
router.put('/:postId', updatePostDetail);
router.delete('/:postId', deletePostById);
router.post('/:postId/verify-password', verifyPostPasswordHandler);
router.post('/:postId/like', likePostHandler);
router.get('/:postId/visibility', getPostVisibility);

export default router;
