import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (postId, data) => {
    const comment = await prisma.comment.create({
        data: {
            postId,
            ...data,
        },
    });
    return comment;
};

export const getCommentsByPostId = async (postId, page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const [comments, totalItemCount] = await prisma.$transaction([
        prisma.comment.findMany({
            where: { postId },
            skip,
            take: pageSize,
        }),
        prisma.comment.count({ where: { postId } }),
    ]);
    const totalPages = Math.ceil(totalItemCount / pageSize);
    return { currentPage: page, totalPages, totalItemCount, data: comments };
};

export const deleteCommentById = async (id) => {
    try {
        await prisma.comment.delete({
            where: { id },
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const updateCommentById = async (id, data) => {
    try {
        const updatedComment = await prisma.comment.update({
            where: { id },
            data,
        });
        return updatedComment;
    } catch (error) {
        return null;
    }
};
