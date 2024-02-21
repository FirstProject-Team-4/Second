import { get, push, ref, update } from "firebase/database"
import { db } from "../config/config-firebase"


/**
 * Combines the user ID and friend ID and returns a sorted and joined string.
 * @param userID - The user ID.
 * @param friendID - The friend ID.
 * @returns The combined and sorted string of user ID and friend ID.
 */
export const combineId = (userID: string, friendID: string) => {
    return [userID, friendID].sort().join('');
}

/**
 * Adds a friend to the current user's friend list and updates the database accordingly.
 * 
 * @param currentUser - The current user object containing the handle and uid.
 * @param friendUser - The friend user object containing the handle, uid, and id.
 */
export const addFriend = (currentUser: { handle: string, uid: string, }, friendUser: { handle: string, uid: string, id: string }) => {
    const updateCurrentUser: { [key: string]: any } = {};

    updateCurrentUser[`/users/${currentUser.handle}/friendsRequest/${friendUser.id}`] = null;
    update(ref(db), updateCurrentUser);
    update(ref(db, `/users/${currentUser.handle}/friends/${friendUser.handle}`), friendUser)
    update(ref(db, `/users/${friendUser.handle}/friends/${currentUser.handle}`), currentUser)

    const messages = {
        [currentUser.handle]: currentUser,
        [friendUser.handle]: friendUser
    }
    update(ref(db, `/chat/${combineId(currentUser.uid, friendUser.uid)}`), messages);
}

/**
 * Rejects a friend request from a user.
 * 
 * @param currentUser - The current user object.
 * @param friendUser - The friend user object.
 */
export const rejectFriend = (currentUser: { handle: string, uid: string, }, friendUser: { handle: string, uid: string, id: string }) => {
    const updateCurrentUser: { [key: string]: any } = {};
    updateCurrentUser[`/users/${currentUser.handle}/friendsRequest/${friendUser.id}`] = null;
    update(ref(db), updateCurrentUser);
}

/**
 * Removes a friend connection between two users.
 * 
 * @param currentUserHandle - The handle of the current user.
 * @param friendsUserHandle - The handle of the friend user to be removed.
 */
export const removeFriend = (currentUserHandle: string, friendsUserHandle: string) => {
    const updateCurrentUser: { [key: string]: any } = {};
    updateCurrentUser[`/users/${currentUserHandle}/friends/${friendsUserHandle}`] = null;
    updateCurrentUser[`/users/${friendsUserHandle}/friends/${currentUserHandle}`] = null;
    update(ref(db), updateCurrentUser);

}
/**
 * Retrieves the messages for a given chat ID.
 * @param chatID - The ID of the chat.
 * @returns A promise that resolves to an array of messages.
 */
export const getMessages = async (chatID: string) => {
    const snapshot = await get(ref(db, `chat/${chatID}/messages`));
    if (!snapshot.exists()) {
        return [];
    }
    const messages = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
    }))
    return messages;
}

/**
 * Retrieves the owners of a chat.
 * @param chatID - The ID of the chat.
 * @returns An array of chat owners.
 */
export const chatOwners = async (chatID: string) => {
    const snapshot = await get(ref(db, `chat/${chatID}`));
    if (!snapshot.exists()) {
        return [];
    }
    return snapshot.val();
}

/**
 * Sends a message to a chat.
 * @param chatID - The ID of the chat.
 * @param message - The message to be sent, containing author, createdOn, and content.
 */
export const sendMessage = (chatID: string, message: { author: string, createdOn: number, content: string }) => {
    push(ref(db, `/chat/${chatID}/messages`), message);
}

