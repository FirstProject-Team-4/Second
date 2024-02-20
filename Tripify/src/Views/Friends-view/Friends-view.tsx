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
            {userData?.friendsRequest ? <div className='friend-request-id'>
                {<FriendRequests friendsRequest={userData.friendsRequest} />}
            </div>
                : <div className="friend-request-id">no requests</div>}

            {userData?.friends ? <div className='friends-container-id'>
                {<Friends friends={userData.friends} />}
            </div>
                : <div className="friends-container-id">no friends</div>}



        </>
    );
}

