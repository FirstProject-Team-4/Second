import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { combineId, removeFriend } from "../../Service/friends-service";
import { useAppContext } from "../../Context/AppContext";
import { ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";

/**
 * Renders a list of friends and provides functionality to delete a friend and navigate to a chat page.
 * @param friends - The list of friends.
 */
export default function Friends({ friends }: { friends: any }) {

    const [friendList, setFriendList] = useState<any>([]);
    const { userData ,setContext} = useAppContext();
    const nav = useNavigate();
    
    useEffect(() => {
        if (friends) {
            const currentFriendList = Object.keys(friends).map((key) => { return friends[key] });
            setFriendList(currentFriendList);
        }
    }, [userData])

  
    /**
     * Deletes a friend from the friend list and updates the context.
     * @param currentFriend - The friend object to be deleted.
     */
    const deleteFriend = (currentFriend: { handle: string, uid: string }) => {
        if (window.confirm(`Are you sure you want to delete ${currentFriend.handle} from your friends?`)){
            removeFriend(userData.handle, currentFriend.handle)
            setFriendList(friendList.filter((friend: any) => friend.handle !== currentFriend))
            update(ref(db), { [`/chat/${combineId(userData.uid, currentFriend.uid)}`]: null });
            setContext({ ...userData, friends: { ...friendList.filter((friend: any) => friend.handle !== currentFriend) } })
        }
    }

    /**
     * Navigates to the chat page with the specified friend UID.
     * @param friendUID - The UID of the friend.
     */
    const navigateToChat = (friendUID: string) => {
        nav(`/chat/${combineId(userData.uid, friendUID)}`)
    }
    return (
        <>
            <h4>Friends</h4>
            {friendList && friendList.map((friend: any, index: number) => {
                return (
                    <div key={index} className="friend-info">
                        <NavLink to={`/profile/${friend.handle}`}>{friend.handle}</NavLink>
                        <button className='btn' onClick={() => { navigateToChat(friend.uid) }}>Chat</button>
                        <button className='btn' onClick={() => { deleteFriend(friend) }}>Delete</button>
                    </div>
                )
            })}
        </>
    )
}