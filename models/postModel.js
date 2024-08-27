const posts = [];

function createId() {
	let id;
	do {
		id = Math.floor(Math.random() * 100000).toString();
	} while (posts.some(post => post.id === id));
	return id;
}

export const createPostBase = (data) => {
    const post = {
        id: createId(),
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        ...data,
    };
    posts.push(post);
    return post;
};

export const getPostBase = (id) => {
    return posts.find(post => post.id === id);
};

export const updatePostBase = (id, data) => {
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
        const updatedPost = { ...posts[index], ...data };
        posts.splice(index, 1, updatedPost);
        return updatedPost;
    }
    return null;
};


export const deletePostBase = (id) => {
    let found = false;
    posts.forEach((post, index) => {
        if (post.id === id) {
            posts.splice(index, 1);
            found = true;
        }
    });
    return found;
};


export const getPostsInGroup = (groupId, params) => {
    return posts.filter(post => post.groupId === groupId);
};
