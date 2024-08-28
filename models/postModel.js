// src/models/postModel.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (groupId, data) => {
    const post = prisma.post.create({
        data: {
            ...data,
            groupId: parseInt(groupId),
        },
    });

    // 그룹의 postCount 증가
    await prisma.group.update({
        where: { id: parseInt(groupId) },
        data: { postCount: { increment: 1 } },
    });

    return post;
};

export const getPosts = async (groupId, filter) => {
    const [totalItemCount, pagedPosts] = await Promise.all([
        prisma.post.count({ where: { ...filter.where, groupId: parseInt(groupId) } }),
        prisma.post.findMany({
            where: { ...filter.where, groupId: parseInt(groupId) },
            orderBy: filter.orderBy,
            skip: filter.skip,
            take: filter.take,
        }),
    ]);

    return { totalItemCount, pagedPosts };
};

export const getPostById = async (postId) => {
    return await prisma.post.findUnique({
        where: { id: parseInt(postId) },
    });
};

export const updatePost = async (postId, data) => {
    return await prisma.post.update({
        where: { id: parseInt(postId) },
        data,
    });
};

export const deletePost = async (groupId, postId) => {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 게시글 삭제
            await prisma.post.delete({
                where: { id: parseInt(postId) },
            });

            // 그룹의 postCount 감소
            await prisma.group.update({
                where: { id: parseInt(groupId) },
                data: { postCount: { decrement: 1 } },
            });

            return true;
        });

        return result;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
};


export const verifyPostPassword = async (postId, password) => {
    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
    });

    return post && post.postPassword === password;
};

export const likePost = async (postId) => {
    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
    });

    if (post) {
        return await prisma.post.update({
            where: { id: parseInt(postId) },
            data: { likeCount: post.likeCount + 1 },
        });
    }
};

