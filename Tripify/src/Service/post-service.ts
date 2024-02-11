import { ref, push, get, query, orderByChild, update } from 'firebase/database';
import { db } from '../config/config-firebase';

//image: string
export const addPost = async (author: string, title: string, content: string ) => {
    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        image,
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
    }))
        .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    console.log(posts);

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

export const likePost = (handle: string, postId: string) => {
        const updateLikes: { [key: string]: any } = {};
        updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
        updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

        return update(ref(db), updateLikes);
    };

    export const dislikePost = (handle: string, postId: string) => {
        const updateLikes: { [key: string]: any } = {};
        updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
        updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

