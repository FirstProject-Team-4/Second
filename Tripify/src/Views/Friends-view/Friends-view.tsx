import { useEffect, useState } from "react";
import FriendRequests from "../../Components/Friends/FriendRequests";
import { useAppContext } from "../../Context/AppContext"

export default function FriendsView() {
    
    const { userData } = useAppContext();
    console.log(userData);
    useEffect(() => {
       
    }, [userData]);
console.log(userData?.friendsRequest);
    return (
        userData?.friendsRequest?<div>
            { <FriendRequests friendsRequest={userData.friendsRequest} />}
        </div>
        :<div>no requests</div>
    );
}