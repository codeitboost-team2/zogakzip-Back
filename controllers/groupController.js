// src/controllers/groupController.js
import {
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup,
    getGroups,
    verifyGroupPassword,
    likeGroup,
    isGroupPublic,
} from '../models/groupModel.js';

export const registerGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    if (!name || !password || typeof isPublic === 'undefined') {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const newGroup = await createGroup({
            name,
            password,
            imageUrl,
            isPublic,
            introduction,
            likeCount: 0,
            postCount: 0,
            createdAt: new Date().toISOString(),
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
        const { totalItemCount, pagedGroups } = await getGroups(filter);

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
        if (isNaN(groupId)) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        const group = await getGroupById(groupId);

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
        const group = await getGroupById(groupId);

        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        const updateGroup = await updateGroup(groupId, { name, imageUrl, isPublic, introduction });
        res.status(200).json(updateGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: '서버 오류입니다.' });
    }
};

export const deleteGroupById = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        const group = await getGroupById(groupId);

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        await deleteGroup(groupId);

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
        const isVerified = await verifyGroupPassword(groupId, password);

        if (isVerified) {
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
        const updatedGroup = await likeGroup(groupId);

        if (updatedGroup) {
            res.status(200).json({ message: "그룹 공감하기 성공" });
        } else {
            res.status(404).json({ message: "존재하지 않습니다" });
        }
    } catch (error) {
        console.error('Error liking group:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const isGroupPublicHandler = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await isGroupPublic(groupId);

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