export const comments = [];

function createId() {
	let id;
	do {
		id = Math.floor(Math.random() * 100000).toString();
	} while (comments.some(comments => comments.id === id));
	return id;
}

export const createComment = (postId, data) => {
    const comment = {
        id: createId(),
        postId,
        createdAt: new Date().toISOString(),
        ...data,
    };
    comments.push(comment);
    return comment;
};

export const getCommentsByPostId = (postId) => {
    return comments.filter(comment => comment.postId === postId);
};

export const deleteCommentById = (id) => {
    let found = false;
    comments.forEach((comment, index) => {
        if (comment.id === id) {
            comments.splice(index, 1);
            found = true;
        }
    });
    return found;
};

export const updateCommentById = (id, data) => {
    const index = comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
        const updatedComment = { ...comments[index], ...data };
        comments.splice(index, 1, updatedComment);
        return updatedComment;
    }
    return null;
};