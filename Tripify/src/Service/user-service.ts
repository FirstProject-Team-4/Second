import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/config-firebase';

export const getUserByHandle = (handle:string) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle:string, uid:string, email:string) => {
const isAdmin=false;
  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: new Date().valueOf(),isAdmin, likedPosts: {} })
};

export const getUserData = (uid:string) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};