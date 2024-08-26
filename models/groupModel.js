import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createGroup = async (data) => {
    return await prisma.group.create({ data });
};

export const getGroupById = async (id) => {
    return await prisma.group.findUnique({
        where: { id: parseInt(id) },
        include: {
            badges: true,
        },
    });
};

export const updateGroup = async (id, data) => {
    return await prisma.group.update({
        where: { id: parseInt(id) },
        data,
    });
};

export const deleteGroup = async (id) => {
    return await prisma.group.delete({
        where: { id: parseInt(id) },
    });
};

export const getGroups = async (filter) => {
    const [totalItemCount, pagedGroups] = await Promise.all([
        prisma.group.count({ where: filter.where }),
        prisma.group.findMany(filter),
    ]);

    return { totalItemCount, pagedGroups };
};

export const verifyGroupPassword = async (id, password) => {
    const group = await prisma.group.findUnique({
        where: { id: parseInt(id) },
    });

    return group && group.password === password;
};

export const likeGroup = async (id) => {
    const group = await prisma.group.findUnique({
        where: { id: parseInt(id) },
    });

    if (group) {
        return await prisma.group.update({
            where: { id: parseInt(id) },
            data: { likeCount: group.likeCount + 1 },
        });
    }
};

export const isGroupPublic = async (id) => {
    return await prisma.group.findUnique({
        where: { id: parseInt(id) },
        select: { id: true, isPublic: true },
    });
};