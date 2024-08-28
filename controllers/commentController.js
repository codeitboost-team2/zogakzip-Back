import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addComment = async (req, res) => {
    let { postId } = req.params;
    const { nickname, content, commentPassword } = req.body;

    // postId를 정수로 변환
    postId = parseInt(postId, 10);  

    if (isNaN(postId)) {
        return res.status(400).json({ message: '잘못된 게시글 ID입니다.' });
    }

    try {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ message: '게시글이 존재하지 않습니다' });

        if (!nickname || !content || !commentPassword) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }

        const comment = await prisma.comment.create({
            data: {
                postId,
                nickname,
                content,
                commentPassword,
                createdAt: new Date().toISOString(),
            },
        });
        return res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: '서버 오류입니다' });
    }
};

export const getComments = async (req, res) => {
    let { postId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // postId를 정수로 변환
    postId = parseInt(postId, 10);

    if (isNaN(postId)) {
        return res.status(400).json({ message: '잘못된 게시글 ID입니다.' });
    }

    const skip = (page - 1) * pageSize;

    try {
        const postComments = await prisma.comment.findMany({
            where: { postId: postId },
            skip: skip,
            take: parseInt(pageSize, 10),  // pageSize도 정수로 변환
        });

        const totalItemCount = await prisma.comment.count({
            where: { postId: postId },
        });

        const totalPages = Math.ceil(totalItemCount / pageSize);

        return res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalItemCount: totalItemCount,
            data: postComments,
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: '서버 오류입니다' });
    }
};


export const deleteComment = async (req, res) => {
    let { postId, commentId } = req.params;
    const { commentPassword } = req.body;

    // postId를 정수로 변환
    postId = parseInt(postId, 10);
    commentId = parseInt(commentId, 10);

    if (isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ message: '잘못된 게시글 ID 또는 댓글 ID입니다.' });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId, postId: postId },
        });

        if (!comment) return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });

        if (comment.commentPassword !== commentPassword) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return res.status(200).json({ message: '댓글 삭제 성공' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: '서버 오류입니다.' });
    }
};


export const updateComment = async (req, res) => {
    let { postId, commentId } = req.params;
    const { content, commentPassword } = req.body;

    // postId를 정수로 변환
    postId = parseInt(postId, 10);
    commentId = parseInt(commentId, 10);

    if (isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ message: '잘못된 게시글 ID 또는 댓글 ID입니다.' });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId, postId: postId },
        });

        if (!comment) return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });

        if (comment.commentPassword !== commentPassword) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content: content },
        });

        return res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ message: '서버 오류입니다.' });
    }
};