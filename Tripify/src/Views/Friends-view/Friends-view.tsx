import { useEffect, useState } from "react";
import FriendRequests from "../../Components/Friends/FriendRequests";
import { useAppContext } from "../../Context/AppContext"
import Friends from "../../Components/Friends/Friends";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/config-firebase";

export default function FriendsView() {

    const { userData } = useAppContext();
    const[requests, setRequests] = useState<any>({})

    useEffect(() => {
        if (userData?.friendsRequest) {
            setRequests(userData.friendsRequest)
        }
        onValue(ref(db, `users/${userData?.handle}/friendsRequest`), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log(data)
                setRequests(data)
            }
        })
    }, [userData]);
    return (
        <>
            {requests ? <div className='friend-request-id'>
                {<FriendRequests friendsRequest={requests} />}
            </div>
                : <div className="no-friend">no requests</div>}

            {userData?.friends ? <div className='friends-container-id'>
                {<Friends friends={userData.friends} />}
            </div>
                : <div className="no-friend">no friends</div>}

        </>
    );
}

