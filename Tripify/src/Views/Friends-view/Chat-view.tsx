import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { chatOwners, sendMessage } from "../../Service/friends-service";
import { useAppContext } from "../../Context/AppContext";
import UserImage from "../../Components/Post/UserImage/UserImage";
import Button from "../../Components/Button/Button";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/config-firebase";

export default function ChatView() {
    const { id } = useParams<{ id: string }>();
    const { userData } = useAppContext();
    const [currentMessage, setCurrentMessage] = useState('' as string)
    const [messageList, setMessageList] = useState([] as any)
    const [friend, setFriend] = useState({} as any)


    useEffect(() => {
        document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
        document.body.style.backgroundSize = 'contain';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        if (id) {
            const messageRef = ref(db, `/chat/${id}/messages`);
            const unsubscribe = onValue(messageRef, (snapshot) => {
                if (snapshot.exists()) {
                    const messages = Object.keys(snapshot.val()).map(key => ({
                        id: key,
                        ...snapshot.val()[key]
                    }))
                    setMessageList(messages)
                }
            })
     
            chatOwners(id).then((owners) => {
                if (owners) {
                    Object.keys(owners).filter((key) => key !== userData?.handle && key !== `messages`).map((key) => {
                        setFriend(owners[key])
                    })
                }
            })
            return () => unsubscribe()
        }
    }, [id])

    const sendCurrentMessage = () => {
        if (id) {
            sendMessage(id, { author: userData?.handle, createdOn: Number(new Date()), content: currentMessage })
        }
        setCurrentMessage('')

    }

    return (
        <div style={{ background: `red` }}>
            {friend?.handle && <UserImage author={friend.handle} />}
            <h1>{friend?.handle}</h1>
            <div style={{ height: `400px`, width: `200px` }}>
                {messageList && messageList.map((message: any,) => {
                    return (
                        <div key={message.id}>
                            <p>{message.content}</p>
                        </div>
                    )
                })}
            </div>
            <input type="text" value={currentMessage} onChange={(e) => { setCurrentMessage(e.target.value) }} />
            <Button onClick={sendCurrentMessage}>Send message</Button>
        </div>
    )
}