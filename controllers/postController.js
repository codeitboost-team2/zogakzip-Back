// src/controllers/postController.js
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    verifyPostPassword,
    likePost,
} from '../models/postModel.js';

export const registerPost = async (req, res) => {
    const { groupId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, location, moment, isPublic } = req.body;

    if (!nickname || !title || !postPassword || !content || !location || !moment || typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const newPost = await createPost(groupId, {
            nickname,
            title,
            content,
            postPassword,
            imageUrl,
            
            location,
            moment: new Date(moment).toISOString(),
            isPublic,
            likeCount: 0,
            commentCount: 0,
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const listPosts = async (req, res) => {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const filter = {
        where: {
            title: {
                contains: keyword,
            },
            isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
        },
        orderBy: {
            [sortBy === 'mostCommented' ? 'commentCount' :
            sortBy === 'mostLiked' ? 'likeCount' :
            'createdAt']: 'desc'
        },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
    };

    try {
        const { totalItemCount, pagedPosts } = await getPosts(groupId, filter);

        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages: totalPages,
            totalItemCount: totalItemCount,
            data: pagedPosts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

export const getPostDetail = async (req, res) => {
    const { postId } = req.params;

    try {
        if (isNaN(postId)) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const updatePostDetail = async (req, res) => {
    const { postId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, location, moment, isPublic } = req.body;

    try {
        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        if (post.postPassword !== postPassword) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        const updatedPost = await updatePost(postId, { nickname, title, content, imageUrl, location, moment: new Date(moment).toISOString(), isPublic });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: '서버 오류입니다.' });
    }
};

export const deletePostById = async (req, res) => {
    const { groupId, postId } = req.params;
    const { postPassword } = req.body;

    try {
        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        if (post.postPassword !== postPassword) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        await deletePost(groupId, postId);

        res.status(200).json({ message: "게시글 삭제 성공" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const verifyPostPasswordHandler = async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    try {
        const isVerified = await verifyPostPassword(postId, password);

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

export const likePostHandler = async (req, res) => {
    const { postId } = req.params;

    try {
        const updatedPost = await likePost(postId);

        if (updatedPost) {
            res.status(200).json({ message: "게시글 공감하기 성공" });
        } else {
            res.status(404).json({ message: "존재하지 않습니다" });
        }
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: "서버 오류입니다" });
    }
};

export const getPostVisibility = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
        }

        return res.status(200).json({
            id: post.id,
            isPublic: post.isPublic,
        });
    } catch (error) {
        console.error('Error fetching post visibility:', error);
        return res.status(500).json({ message: "서버 오류입니다." });
    }
};