import { get, push, ref, update } from "firebase/database"
import { db } from "../config/config-firebase"


export const combineId = (userID: string, friendID: string) => {
    return [userID, friendID].sort().join('');
}

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

export const rejectFriend = (currentUser: { handle: string, uid: string, }, friendUser: { handle: string, uid: string, id: string }) => {
    const updateCurrentUser: { [key: string]: any } = {};
    updateCurrentUser[`/users/${currentUser.handle}/friendsRequest/${friendUser.id}`] = null;
    update(ref(db), updateCurrentUser);
}

export const removeFriend = (currentUserHandle: string, friendsUserHandle: string) => {
    const updateCurrentUser: { [key: string]: any } = {};
    updateCurrentUser[`/users/${currentUserHandle}/friends/${friendsUserHandle}`] = null;
    updateCurrentUser[`/users/${friendsUserHandle}/friends/${currentUserHandle}`] = null;
    update(ref(db), updateCurrentUser);

}
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
export const chatOwners = async (chatID: string) => {
    const snapshot = await get(ref(db, `chat/${chatID}`));
    if (!snapshot.exists()) {
        return [];
    }
    return snapshot.val();
}
export const sendMessage = (chatID: string, message: { author: string, createdOn: number, content: string }) => {

    push(ref(db, `/chat/${chatID}/messages`), message);
}

