import { useEffect, useState } from "react";
import Button from "../Button/Button";

export default function Friends({ friends}: { friends: any}) {

    const [friendList, setFriendList] = useState<any>([] );
useEffect(() => {
    if(friends){
       const currentFriendList=Object.keys(friends).map((key)=>{return friends[key]});
         setFriendList(currentFriendList);
    }
},[])

    return (
        <div>
            {friendList && friendList.map((friend: any, index: number) => {
                return (
                    <div key={index}>
                        <p>{friend.handle}</p>
                        <Button>Send message</Button>
                        <Button>Delete friend</Button>
                    </div>
                )
            })}
        </div>
    )
}