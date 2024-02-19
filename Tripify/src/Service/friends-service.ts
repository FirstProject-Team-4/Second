import { push, ref, update } from "firebase/database"
import { db } from "../config/config-firebase"



export const addFriend = (currentUser:{handle:string,uid:string,},friendUser:{handle:string,uid:string,id:string}) => {
    const updateCurrentUser: { [key: string]: any } = {};
    console.log(currentUser)
    console.log(friendUser)
    updateCurrentUser[`/users/${currentUser.handle}/friendsRequest/${friendUser.id}`] = null;
     update(ref(db), updateCurrentUser);

     push(ref(db, `/users/${currentUser.handle}/friends`),friendUser)
     push(ref(db, `/users/${friendUser.handle}/friends`),currentUser)
}
export const rejectFriend = (currentUser:{handle:string,uid:string,},friendUser:{handle:string,uid:string}) => {
}
