import { ref, push, get, query, orderByChild, update } from 'firebase/database';
import { db } from '../config/config-firebase';

//image: string
export const addPost = async (author: string, title: string, content: string ) => {
    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        image,
        likes: 0,
        dislikes:0,
        createdOn: Date.now(),
    });
};

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
    }))
        .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

    return posts;
};

export const getPostById = async (id: string) => {

    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) {
        return null;
    }

    const post = {
        id,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn).toString(),
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    };

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

export const addLike = (handle: string, postId: string,likesCount:number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/likes/`] = likesCount;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;
    

    return update(ref(db), updateLikes);
};
export const addDislike = (handle: string, postId: string,dislikeCount:number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = true;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = true;
    

    return update(ref(db), updateLikes);
};

export const removeLike = (handle: string, postId: string,likes:number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/likes/`] = likes;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};
export const removeDislike = (handle: string, postId: string,dislikeCount:number) => {
    const updateLikes: { [key: string]: any } = {};
    updateLikes[`/posts/${postId}/dislikesBy/${handle}`] = null;
    updateLikes[`/posts/${postId}/dislikes/`] = dislikeCount;
    updateLikes[`/users/${handle}/dislikedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

