import express from 'express';
import {
    addComment,
    getComments,
    deleteComment,
    updateComment,
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

// 댓글 등록
router.post('/', addComment);

// 댓글 목록 조회
router.get('/', getComments);

// 댓글 수정
router.put('/:commentId', updateComment);

// 댓글 삭제
router.delete('/:commentId', deleteComment);

export default router;