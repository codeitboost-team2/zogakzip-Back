import {
    createComment,
    getCommentsByPostId,
    deleteCommentById,
    updateCommentById,
} from '../models/commentModel.js';

import { getPostById } from '../models/postModel.js';
import { comments } from '../models/commentModel.js';

export const addComment = (req, res) => {
    const { postId } = req.params;
    const { nickname, content, commentPassword } = req.body;

    const post = getPostById(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    if (!nickname || !content || !commentPassword) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const comment = createComment(postId, { nickname, content, commentPassword });
    return res.status(201).json(comment);
};

export const getComments = (req, res) => {
    const { postId } = req.params;

    const postComments = getCommentsByPostId(postId);
    return res.status(200).json(postComments);
};

export const deleteComment = (req, res) => {
    const { commentId } = req.params;
    const { commentPassword } = req.body;

    const comment = comments.find(comment => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });

    if (comment.commentPassword !== commentPassword) {
        return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    deleteCommentById(commentId);
    return res.status(200).json({ message: '댓글 삭제 성공' });
};

export const updateComment = (req, res) => {
    const { commentId } = req.params;
    const { content, commentPassword } = req.body;

    const comment = comments.find(comment => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });

    if (comment.commentPassword !== commentPassword) {
        return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    const updatedComment = updateCommentById(commentId, { content });
    return res.status(200).json(updatedComment);
};