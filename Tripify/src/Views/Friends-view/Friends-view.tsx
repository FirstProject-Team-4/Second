import { useEffect } from "react";
import FriendRequests from "../../Components/Friends/FriendRequests";
import { useAppContext } from "../../Context/AppContext"
import Friends from "../../Components/Friends/Friends";

export default function FriendsView() {

    const { userData } = useAppContext();

    useEffect(() => {
    }, [userData]);
    return (
        <>
            {userData?.friendsRequest ? <div className='friend-request-id'>
                {<FriendRequests friendsRequest={userData.friendsRequest} />}
            </div>
                : <div className="no-friend">no requests</div>}

            {userData?.friends ? <div className='friends-container-id'>
                {<Friends friends={userData.friends} />}
            </div>
                : <div className="no-friend">no friends</div>}

        </>
    );
}

