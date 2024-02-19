import { useEffect, useState } from "react";
import FriendRequests from "../../Components/Friends/FriendRequests";
import { useAppContext } from "../../Context/AppContext"
import Friends from "../../Components/Friends/Friends";

export default function FriendsView() {
    
        const { userData } = useAppContext();
        console.log(userData);
        useEffect(() => {
           
        }, [userData]);
    console.log(userData?.friendsRequest);
        return (
            <>
            {userData?.friendsRequest?<div>
                { <FriendRequests friendsRequest={userData.friendsRequest} />}
            </div>
            :<div>no requests</div>}
            {userData?.friends?<div>
                {<Friends friends={userData.friends}/>}:<div>no friends</div>
            </div>
            :<div>no friends</div>}
            </>
        );
    
}