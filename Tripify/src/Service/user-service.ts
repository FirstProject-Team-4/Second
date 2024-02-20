import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/config-firebase';

export const getUserByHandle = (handle: string) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle: string, uid: string, email: string) => {
  const isAdmin = false;

  return set(ref(db, `users/${handle}`), { handle, uid, email, firstName: 'None', lastName: 'None', phoneNumber: 'None', bio: 'None', createdOn: new Date().valueOf(), isAdmin, isBlock: false, likedPosts: {}, friendsRequest: {} })
};

export const getUserData = (uid: string) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};


export const getAllUsers = async () => {
  const snapshot = await get(query(ref(db, 'users')));
  if (!snapshot.exists()) {
    return [];
  }

  const users = Object.keys(snapshot.val()).map(key => ({
    id: key,
    ...snapshot.val()[key],
    createdOn: new Date(snapshot.val()[key].createdOn).toString(),
    likedPosts: snapshot.val()[key].likedPosts ? Object.keys(snapshot.val()[key].likedPosts) : [],
    imageUrl: snapshot.val().imageUrl,
    dislikedPosts: snapshot.val()[key].dislikedPosts ? Object.keys(snapshot.val()[key].dislikedPosts) : [],
  }))


  return users;

}
