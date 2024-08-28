import {
    createPostBase,
    getPostBase,
    updatePostBase,
    deletePostBase,
    getPostsInGroup,} from '../models/postModel.js';

export const registerPost = (req, res) => {
    const { groupId } = req.params;
    const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    if (!nickname || !title || !content || !postPassword || !groupPassword || !imageUrl || !moment || typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const post = createPostBase({ groupId, nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic });
    return res.status(201).json(post);
};

export const updatePost = (req, res) => {
    const { postId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    if (post.postPassword !== postPassword) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

    const updatedPost = updatePostBase(postId, { nickname, title, content, imageUrl, tags, location, moment, isPublic });
    return res.status(200).json(updatedPost);
};

export const deletePost = (req, res) => {
    const { postId } = req.params;
    const { postPassword } = req.body;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    if (post.postPassword !== postPassword) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

    deletePostBase(postId);
    return res.status(200).json({ message: '게시글 삭제 성공' });
};

export const getPostsList = (req, res) => {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

    let posts = getPostsInGroup(groupId, { page, pageSize, sortBy, keyword, isPublic });

    // 공개 여부 필터링
	if (isPublic !== undefined) {
		posts = posts.filter(function(post) {
			return post.isPublic === (isPublic === 'true');
		});
	}

	// 키워드 검색 (제목 및 태그에서 검색)
	if (keyword) {
		posts = posts.filter(function(post) {
			return post.title.includes(keyword) || (post.tags && post.tags.includes(keyword));
		});
	}

	// 정렬
	if (sortBy === 'latest') {
		posts.sort(function(a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt);
		});
	} else if (sortBy === 'comment') {
		posts.sort(function(a, b) {
			return b.commentCount - a.commentCount;
		});
	} else if (sortBy === 'like') {
		posts.sort(function(a, b) {
			return b.likeCount - a.likeCount;
		});
	}

    return res.status(200).json({
        currentPage: parseInt(page),
        filtersApplied: {
            isPublic: isPublic !== undefined ? isPublic : 'all',
            keyword: keyword || 'none',
            sortBy: sortBy || 'latest'
        },
        data: posts,
    });
};

export const getPostDetail = (req, res) => {
    const { postId } = req.params;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    return res.status(200).json(post);
};

export const verifyPostPassword = (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    if (post.postPassword === password) {
        return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } else {
        return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }
};

export const likePost = (req, res) => {
    const { postId } = req.params;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    post.likeCount += 1;
    return res.status(200).json({ message: '게시글 공감하기 성공' });
};

export const isGroupPublicHandler = (req, res) => {
    const { postId } = req.params;

    const post = getPostBase(postId);
    if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

    return res.status(200).json({ id: post.id, isPublic: post.isPublic });
};