import { ref, push, get, query, orderByChild, update } from 'firebase/database';
import { db } from '../config/config-firebase';
import { getAllUsers } from './user-service';

//image: string
export const addPost = async (author: string, title: string, content: string, image: any = '',userImage:string) => {
    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        image,
        likes: 0,
        dislikes: 0,
        createdOn: Date.now(),
        commentsCount: 0,
        userImage

    });
};
//Todo:
// export const getAllPosts = async (search: string) => {
//     const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));
//     if (!snapshot.exists()) {
//         return [];
//     }

//     const posts = Object.keys(snapshot.val()).map(key => ({
//         id: key,
//         ...snapshot.val()[key],
//         createdOn: new Date(snapshot.val()[key].createdOn).toString(),
//         likedBy: snapshot.val()[key].likedBy ? Object.keys(snapshot.val()[key].likedBy) : [],
//         imageUrl: snapshot.val().imageUrl,
//         dislikesBy: snapshot.val()[key].dislikesBy ? Object.keys(snapshot.val()[key].dislikesBy) : [],
//         commentsCount: snapshot.val()[key].commentsCount,
//     }))
//         .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

//     return posts;
// }; 
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
        comments: snapshot.val()[key].comments ? Object.keys(snapshot.val()[key].comments).map(c => {
            return {
                id: c,
                ...snapshot.val()[key].comments[c],
                createdOn: new Date(snapshot.val()[key].comments[c].createdOn).toString(),
                replyCounter: snapshot.val()[key].comments[c].replies ? Object.keys(snapshot.val()[key].comments[c].replies).length : 0,
                likedBy: snapshot.val()[key].comments[c].likedBy ? Object.keys(snapshot.val()[key].comments[c].likedBy) : [],
                dislikesBy: snapshot.val()[key].comments[c].dislikesBy ? Object.keys(snapshot.val()[key].comments[c].dislikesBy) : [],
                replies: snapshot.val()[key].comments[c].replies ? Object.keys(snapshot.val()[key].comments[c].replies).map(r => {
                    return {
                        id: r,
                        ...snapshot.val()[key].comments[c].replies[r],
                        likedBy: snapshot.val()[key].comments[c].replies[r].likedBy ? Object.keys(snapshot.val()[key].comments[c].replies[r].likedBy) : [],
                        dislikesBy: snapshot.val()[key].comments[c].replies[r].dislikesBy ? Object.keys(snapshot.val()[key].comments[c].replies[r].dislikesBy) : [],
                        createdOn: new Date(snapshot.val()[key].comments[c].replies[r].createdOn).toString(),
                    }
                }) : [],
            }
        }) : [],
    }))
        .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

    return posts;
};
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
// export const getPostById = async (id: string) => {
//     const snapshot = await get(ref(db, `posts/${id}`));
//     if (!snapshot.exists()) {
//       return null;
//     }

//     const post = {
//       id,
//       ...snapshot.val(),
//       createdOn: new Date(snapshot.val().createdOn).toString(),
//       likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
//       imageUrl: snapshot.val().imageUrl, // Include imageUrl 
//     };

//     return post;
//   };

export const addLike = (handle: string, postId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/likes/`] = likesCount;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;


    return update(ref(db), updateLikes);
};
export const addDislike = (handle: string, postId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = true;


    return update(ref(db), updateLikes);
};

export const removeLike = (handle: string, postId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/likes/`] = likes;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};
export const removeDislike = (handle: string, postId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

export const addLikeComment = (handle: string, postId: string, commentId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/likes/`] = likesCount;

    return update(ref(db), updateLikes);
}

export const addDislikeComment = (handle: string, postId: string, commentId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);

}

export const removeLikeComment = (handle: string, postId: string, commentId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/likes/`] = likes;
    return update(ref(db), updateLikes);
}

export const removeDislikeComment = (handle: string, postId: string, commentId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

export const addLikeReply = (handle: string, postId: string, commentId: string, replyId: string, likesCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    console.log(replyId, postId, commentId, likesCount, handle)
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likes/`] = likesCount;
    return update(ref(db), updateLikes);
}

export const addDislikeReply = (handle: string, postId: string, commentId: string, replyId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

export const removeLikeReply = (handle: string, postId: string, commentId: string, replyId: string, likes: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/likes/`] = likes;
    return update(ref(db), updateLikes);
}

export const removeDislikeReply = (handle: string, postId: string, commentId: string, replyId: string, dislikeCount: number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikes/`] = dislikeCount;
    return update(ref(db), updateLikes);
}

export const addComment = async (postId: string, userData: { handle: string , userImage:string}, content: string) => {
   console.log(userData);
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
        userImage:userData.userImage,
    });
};
export const addReply = async (commentId: string, postId: string, author: string, content: string, userData: { userImage:string}) => {
   console.log(userData);
   userData.userImage = userData.userImage ? userData.userImage : '';
    return push(ref(db, `posts/${postId}/comments/${commentId}/replies/`), {
        author,
        content,
        createdOn: Date.now(),
        postId,
        commentId,
        likes: 0,
        dislikes: 0,
        userImage:userData.userImage,
    });
}




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
export const deleteComment = async (postId: string, commentId: string) => {

    const deleteComment: { [key: string]: any } = {};
    deleteComment[`posts/${postId}/comments/${commentId}`] = null;
    update(ref(db), deleteComment)
}
export const deleteReply = async (postId: string, commentId: string, replyId: string) => {
    const deleteReply: { [key: string]: any } = {};

    deleteReply[`posts/${postId}/comments/${commentId}/replies/${replyId}`] = null;
    update(ref(db), deleteReply)
}
