import { ref, push, get, query, orderByChild, update, equalTo } from 'firebase/database';
import { db } from '../config/config-firebase';
import { getAllUsers } from './user-service';

/**
 * Adds a new post to the database.
 * 
 * @param author - The author of the post.
 * @param title - The title of the post.
 * @param content - The content of the post.
 * @param image - The image associated with the post (optional).
 * @param userImage - The image of the user who created the post.
 * @param category - The category of the post.
 * @returns A Promise that resolves with the newly added post.
 */
export const addPost = async (author: string, title: string, content: string, image: any = '', userImage: string, category: string) => {
    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        image,
        likes: 0,
        dislikes: 0,
        createdOn: Date.now(),
        commentsCount: 0,
        userImage,
        category,
    });
};

/**
 * Retrieves all posts from the database based on a search query.
 * @param search - The search query to filter the posts by.
 * @returns An array of posts that match the search query.
 */
export const getAllPosts = async (search: string) => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));
    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key],
        createdOn: new Date(snapshot.val()[key].createdOn).toString(),
        likedBy: snapshot.val()[key].likedBy ? Object.keys(snapshot.val()[key].likedBy) : [],
        imageUrl: snapshot.val().imageUrl,
        dislikesBy: snapshot.val()[key].dislikesBy ? Object.keys(snapshot.val()[key].dislikesBy) : [],
        commentsCount: snapshot.val()[key].commentsCount,
    }))
        .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

    return posts;
};

/**
 * Retrieves all posts by a specific user.
 * @param username - The username of the user.
 * @returns An array of posts by the user.
 */
export const getAllPostsByUser = async (username: string) => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));
    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key],
        createdOn: new Date(snapshot.val()[key].createdOn).toString(),
        likedBy: snapshot.val()[key].likedBy ? Object.keys(snapshot.val()[key].likedBy) : [],
        imageUrl: snapshot.val().imageUrl,
        dislikesBy: snapshot.val()[key].dislikesBy ? Object.keys(snapshot.val()[key].dislikesBy) : [],
        commentsCount: snapshot.val()[key].commentsCount,
    }))

    return posts.filter(p => p.author === username);
};

/**
 * Retrieves a post by its ID from the database.
 * @param id - The ID of the post to retrieve.
 * @returns A Promise that resolves to the post object, or null if the post does not exist.
 */
export const getPostById = async (id: string) => {

    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) {
        return null;
    }

    const post = [{
        id,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn).toString(),
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
        imageUrl: snapshot.val().imageUrl,
        dislikesBy: snapshot.val().dislikesBy ? Object.keys(snapshot.val().dislikesBy) : [],
        commentsCount: snapshot.val().commentsCount,
        comments: snapshot.val().comments ? Object.keys(snapshot.val().comments).map(c => {
            return {
                id: c,
                ...snapshot.val().comments[c],
                createdOn: new Date(snapshot.val().comments[c].createdOn).toString(),
                replyCounter: snapshot.val().comments[c].replies ? Object.keys(snapshot.val().comments[c].replies).length : 0,
                likedBy: snapshot.val().comments[c].likedBy ? Object.keys(snapshot.val().comments[c].likedBy) : [],
                dislikesBy: snapshot.val().comments[c].dislikesBy ? Object.keys(snapshot.val().comments[c].dislikesBy) : [],
                replies: snapshot.val().comments[c].replies ? Object.keys(snapshot.val().comments[c].replies).map(r => {
                    return {
                        id: r,
                        ...snapshot.val().comments[c].replies[r],
                        likedBy: snapshot.val().comments[c].replies[r].likedBy ? Object.keys(snapshot.val().comments[c].replies[r].likedBy) : [],
                        dislikesBy: snapshot.val().comments[c].replies[r].dislikesBy ? Object.keys(snapshot.val().comments[c].replies[r].dislikesBy) : [],
                        createdOn: new Date(snapshot.val().comments[c].replies[r].createdOn).toString(),
                    }
                }) : [],
            }
        }) : [],

    }];

    return post;
};

/**
 * Adds a like to a post and updates the corresponding data in the database.
 * 
 * @param handle - The handle of the user who is adding the like.
 * @param postId - The ID of the post to which the like is being added.
 * @param likesCount - The current number of likes on the post.
 * @returns A Promise that resolves when the database is updated successfully.
 */
export const addLike = (handle: string, postId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/likes/`] = likesCount;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;


    return update(ref(db), updateLikes);
};

/**
 * Adds a dislike to a post.
 * 
 * @param handle - The handle of the user disliking the post.
 * @param postId - The ID of the post being disliked.
 * @param dislikeCount - The current count of dislikes for the post.
 * @returns A Promise that resolves when the dislikes are successfully updated.
 */
export const addDislike = (handle: string, postId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = true;

    return update(ref(db), updateLikes);
};

/**
 * Removes a like from a post.
 * 
 * @param handle - The handle of the user who liked the post.
 * @param postId - The ID of the post.
 * @param likes - The current number of likes on the post.
 * @returns A Promise that resolves when the like is successfully removed.
 */
export const removeLike = (handle: string, postId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/likes/`] = likes;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

/**
 * Removes a dislike from a post.
 * 
 * @param handle - The handle of the user who disliked the post.
 * @param postId - The ID of the post.
 * @param dislikeCount - The current number of dislikes for the post.
 * @returns A Promise that resolves when the dislikes are updated in the database.
 */
export const removeDislike = (handle: string, postId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

/**
 * Adds a like to a comment on a post.
 * 
 * @param handle - The handle of the user who liked the comment.
 * @param postId - The ID of the post containing the comment.
 * @param commentId - The ID of the comment to be liked.
 * @param likesCount - The current number of likes on the comment.
 * @returns A Promise that resolves when the like is added successfully.
 */
export const addLikeComment = (handle: string, postId: string, commentId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/likes/`] = likesCount;

    return update(ref(db), updateLikes);
}

/**
 * Adds a dislike to a comment in a post.
 * 
 * @param handle - The handle of the user disliking the comment.
 * @param postId - The ID of the post containing the comment.
 * @param commentId - The ID of the comment to dislike.
 * @param dislikeCount - The current dislike count of the comment.
 * @returns A Promise that resolves when the dislikes are updated in the database.
 */
export const addDislikeComment = (handle: string, postId: string, commentId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);

}

/**
 * Removes a like from a comment.
 * @param handle - The handle of the user who liked the comment.
 * @param postId - The ID of the post containing the comment.
 * @param commentId - The ID of the comment.
 * @param likes - The current number of likes for the comment.
 * @returns A promise that resolves when the like is removed.
 */
export const removeLikeComment = (handle: string, postId: string, commentId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/likes/`] = likes;
    return update(ref(db), updateLikes);
}

/**
 * Removes a dislike from a comment.
 * 
 * @param handle - The handle of the user who disliked the comment.
 * @param postId - The ID of the post containing the comment.
 * @param commentId - The ID of the comment.
 * @param dislikeCount - The current number of dislikes for the comment.
 * @returns A Promise that resolves when the dislikes are updated in the database.
 */
export const removeDislikeComment = (handle: string, postId: string, commentId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

/**
 * Adds a like to a reply in a comment of a post.
 * 
 * @param handle - The handle of the user who liked the reply.
 * @param postId - The ID of the post.
 * @param commentId - The ID of the comment.
 * @param replyId - The ID of the reply.
 * @param likesCount - The number of likes for the reply.
 * @returns A promise that resolves when the like is added successfully.
 */
export const addLikeReply = (handle: string, postId: string, commentId: string, replyId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likes/`] = likesCount;
    return update(ref(db), updateLikes);
}

/**
 * Adds a dislike to a reply in a comment of a post.
 * 
 * @param handle - The handle of the user disliking the reply.
 * @param postId - The ID of the post containing the comment and reply.
 * @param commentId - The ID of the comment containing the reply.
 * @param replyId - The ID of the reply to be disliked.
 * @param dislikeCount - The current number of dislikes for the reply.
 * @returns A Promise that resolves when the dislikes are updated in the database.
 */
export const addDislikeReply = (handle: string, postId: string, commentId: string, replyId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

/**
 * Removes a like from a reply.
 * 
 * @param handle - The handle of the user who is removing the like.
 * @param postId - The ID of the post containing the comment and reply.
 * @param commentId - The ID of the comment containing the reply.
 * @param replyId - The ID of the reply to remove the like from.
 * @param likes - The current number of likes for the reply.
 * @returns A Promise that resolves when the like is successfully removed.
 */
export const removeLikeReply = (handle: string, postId: string, commentId: string, replyId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likes/`] = likes;
    return update(ref(db), updateLikes);
}

/**
 * Removes a dislike from a reply.
 * 
 * @param handle - The handle of the user who dislikes the reply.
 * @param postId - The ID of the post containing the reply.
 * @param commentId - The ID of the comment containing the reply.
 * @param replyId - The ID of the reply to remove the dislike from.
 * @param dislikeCount - The current count of dislikes for the reply.
 * @returns A promise that resolves when the dislike is removed.
 */
export const removeDislikeReply = (handle: string, postId: string, commentId: string, replyId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

/**
 * Adds a comment to a post.
 * @param postId - The ID of the post.
 * @param userData - The user data containing the handle and user image.
 * @param content - The content of the comment.
 */
export const addComment = async (postId: string, userData: { handle: string, userImage: string }, content: string) => {
    userData.userImage = userData.userImage ? userData.userImage : '';

    push(ref(db, `posts/${postId}/comments/`), {
        postId,
        author: userData.handle,
        content,
        createdOn: Date.now(),
        replies: {},
        likes: 0,
        dislikes: 0,
        replyCounter: 0,
        userImage: userData.userImage,
    });
};
/**
 * Adds a reply to a comment in a post.
 * @param commentId - The ID of the comment.
 * @param postId - The ID of the post.
 * @param author - The author of the reply.
 * @param content - The content of the reply.
 * @param userData - The user data containing the user image.
 * @returns A Promise that resolves with the result of the push operation.
 */
export const addReply = async (commentId: string, postId: string, author: string, content: string, userData: { userImage: string }) => {
    userData.userImage = userData.userImage ? userData.userImage : '';
    return push(ref(db, `posts/${postId}/comments/${commentId}/replies/`), {
        author,
        content,
        createdOn: Date.now(),
        postId,
        commentId,
        likes: 0,
        dislikes: 0,
        userImage: userData.userImage,
    });
}


/**
 * Deletes a post and removes it from the likedPosts and dislikedPosts arrays of all users who have interacted with it.
 * @param postId - The ID of the post to be deleted.
 */
export const deletePost = async (postId: string) => {
    const user = await getAllUsers();
    user.forEach(u => {
        if (u.likedPosts) {
            if (u.likedPosts.includes(postId)) {
                const updateLikes: { [key: string]: any } = {};
                updateLikes[`/users/${u.handle}/likedPosts/${postId}`] = null;
                update(ref(db), updateLikes);
            }
        }
        if (u.dislikedPosts) {
            if (u.dislikedPosts.includes(postId)) {
                const updateLikes: { [key: string]: any } = {};
                updateLikes[`/users/${u.handle}/dislikedPosts/${postId}`] = null;
                update(ref(db), updateLikes);
            }
        }
    })
    const deletePost: { [key: string]: any } = {};
    deletePost[`posts/${postId}`] = null;
    update(ref(db), deletePost)
}
/**
 * Deletes a comment from a post.
 * @param postId The ID of the post.
 * @param commentId The ID of the comment to be deleted.
 */
export const deleteComment = async (postId: string, commentId: string) => {

    const deleteComment: { [key: string]: any } = {};
    deleteComment[`posts/${postId}/comments/${commentId}`] = null;
    update(ref(db), deleteComment)
}
/**
 * Deletes a reply from a comment in a post.
 * @param postId - The ID of the post.
 * @param commentId - The ID of the comment.
 * @param replyId - The ID of the reply to be deleted.
 */
export const deleteReply = async (postId: string, commentId: string, replyId: string) => {
    const deleteReply: { [key: string]: any } = {};

    deleteReply[`posts/${postId}/comments/${commentId}/replies/${replyId}`] = null;
    update(ref(db), deleteReply)
}

/**
 * Retrieves posts by category from the database.
 * @param category - The category of the posts to retrieve.
 * @returns An array of posts matching the specified category.
 */
export const getPostsByCategory = async (category: string) => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('category'), equalTo(category)));
    if (!snapshot.exists()) {
        return [];
    }
    return Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key],
        createdOn: new Date(snapshot.val()[key].createdOn).toString(),
        likedBy: snapshot.val()[key].likedBy ? Object.keys(snapshot.val()[key].likedBy) : [],
        imageUrl: snapshot.val().imageUrl,
        dislikesBy: snapshot.val()[key].dislikesBy ? Object.keys(snapshot.val()[key].dislikesBy) : [],
        commentsCount: snapshot.val()[key].commentsCount,
    }))
}
