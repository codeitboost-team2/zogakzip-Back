import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    if (!name || !password || typeof isPublic === 'undefined') {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const newGroup = await prisma.group.create({
            data: {
                name,
                password,
                imageUrl,
                isPublic,
                introduction,
                likeCount: 0,
                postCount: 0,
                createdAt: new Date().toISOString(),
            },
        });

        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const listGroups = async (req, res) => {
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const filter = {
        where: {
            name: {
                contains: keyword,
            },
            isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
        },
        orderBy: {
            [sortBy === 'mostPosted' ? 'postCount' :
            sortBy === 'mostLiked' ? 'likeCount' :
            sortBy === 'mostBadge' ? 'badgeCount' :
            'createdAt']: 'desc'
        },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
    };

    try {
        const pagedGroups = await prisma.group.findMany(filter);
        const totalItemCount = await prisma.group.count({ where: filter.where });

        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages: totalPages,
            totalItemCount: totalItemCount,
            data: pagedGroups,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

export const getGroupDetail = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
            include: { badges: true }, // 예시로 배지 포함
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        const responseData = {
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges.map(badge => badge.name),
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const updateGroupDetail = async (req, res) => {
    const { groupId } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
        });

        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId, 10) },
            data: { name, imageUrl, isPublic, introduction },
        });

        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: '서버 오류입니다.' });
    }
};

export const deleteGroupById = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        await prisma.group.delete({
            where: { id: parseInt(groupId, 10) },
        });

        res.status(200).json({ message: "그룹 삭제 성공" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const verifyGroupPasswordHandler = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        if (group.password === password) {
            return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
        } else {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

export const likeGroupHandler = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId, 10) },
            data: { likeCount: group.likeCount + 1 },
        });

        res.status(200).json({ message: "그룹 공감하기 성공", updatedGroup });
    } catch (error) {
        console.error('Error liking group:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const isGroupPublicHandler = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) },
            select: { id: true, isPublic: true },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        res.status(200).json({
            id: group.id,
            isPublic: group.isPublic
        });
    } catch (error) {
        console.error('Error retrieving group public status:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};