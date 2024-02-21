import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/config-firebase';

/**
 * Retrieves a user by their handle.
 * @param handle - The handle of the user.
 * @returns A Promise that resolves to the user data.
 */
export const getUserByHandle = (handle: string) => {

  return get(ref(db, `users/${handle}`));
};

/**
 * Creates a user handle with the provided information.
 * @param handle - The handle of the user.
 * @param uid - The unique identifier of the user.
 * @param email - The email address of the user.
 * @returns A Promise that resolves when the user handle is created.
 */
export const createUserHandle = (handle: string, uid: string, email: string) => {
  const isAdmin = false;

  return set(ref(db, `users/${handle}`), { handle, uid, email, firstName: 'None', lastName: 'None', phoneNumber: 'None', bio: 'None', createdOn: new Date().valueOf(), isAdmin, isBlock: false, likedPosts: {}, friendsRequest: {} })
};

/**
 * Retrieves user data based on the provided user ID.
 * @param uid The user ID to retrieve data for.
 * @returns A Promise that resolves to the user data.
 */
export const getUserData = (uid: string) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};


/**
 * Retrieves all users from the database.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of users.
 */
export const getAllUsers = async () => {
  const snapshot = await get(query(ref(db, 'users')));
  if (!snapshot.exists()) {
    return [];
  }

  /**
   * Converts the snapshot value into an array of user objects.
   * @param snapshot - The snapshot value from Firebase.
   * @returns An array of user objects.
   */
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
