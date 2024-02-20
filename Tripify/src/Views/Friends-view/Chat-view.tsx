import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { chatOwners, getMessages, sendMessage } from "../../Service/friends-service";
import { useAppContext } from "../../Context/AppContext";
import UserImage from "../../Components/Post/UserImage/UserImage";
import Button from "../../Components/Button/Button";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/config-firebase";

export default function ChatView() {
  const  {id} = useParams<{id:string}>();
  const{userData}=useAppContext();
 const [currentMessage,setCurrentMessage]=useState('' as string)
 const [messageList,setMessageList]=useState([] as any)
 const[friend,setFriend]=useState({} as any)

 useEffect(()=>{
    
    if(id){
        const messageRef=ref(db,`/chat/${id}/messages`);
        const unsubscribe=onValue(messageRef,(snapshot)=>{
            if(snapshot.exists()){
                const messages = Object.keys(snapshot.val()).map(key => ({
                    id: key,
                    ...snapshot.val()[key]
                }))
                setMessageList(messages)
            }
        })
        // getMessages(id).then((messages)=>{
        //     setMessageList(messages)
        // })
        chatOwners(id).then((owners)=>{
            if(owners){
                console.log(owners)
                Object.keys(owners).filter((key)=>key!==userData?.handle&&key!==`messages`).map((key)=>{
                    setFriend(owners[key])
                })
            }
        })
        return ()=>unsubscribe()
    }
 },[id])
   
  console.log({friend})
  const sendCurrentMessage=()=>{
    if(id){
    sendMessage(id,{author:userData?.handle,createdOn:Number(new Date()),content:currentMessage})
    }
    // setMessageList([...messageList,{author:userData?.handle,createdOn:Number(new Date()),content:currentMessage}])
    setCurrentMessage('')
   
  }

    return (
        <div style={{background:`red`}}>
            {friend?.handle&&<UserImage author={friend.handle}/>}
            <h1>{friend?.handle}</h1>
            <div style={{height:`400px` ,width:`200px`}}>
            {messageList && messageList.map((message: any,) => {
                return (
                    <div key={message.id}>
                        <p>{message.content}</p>
                    </div>
                )
            })}
            </div>
            <input type="text" value={currentMessage} onChange={(e)=>{setCurrentMessage(e.target.value)}}/>
            <Button onClick={sendCurrentMessage}>Send message</Button>
        </div>
    )
}