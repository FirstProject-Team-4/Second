import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { combineId, removeFriend } from "../../Service/friends-service";
import { useAppContext } from "../../Context/AppContext";
import { ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";

export default function Friends({ friends }: { friends: any }) {

    const [friendList, setFriendList] = useState<any>([]);
    const { userData } = useAppContext();
    const nav = useNavigate();
    useEffect(() => {
        if (friends) {
            const currentFriendList = Object.keys(friends).map((key) => { return friends[key] });
            setFriendList(currentFriendList);
        }
    }, [])

    const deleteFriend = (currentFriend: { handle: string, uid: string }) => {
        removeFriend(userData.handle, currentFriend.handle)
        setFriendList(friendList.filter((friend: any) => friend.handle !== currentFriend))
        update(ref(db), { [`/chat/${combineId(userData.uid, currentFriend.uid)}`]: null });
    }
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