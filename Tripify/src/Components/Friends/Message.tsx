import { useAppContext } from "../../Context/AppContext"
import './Message.css'

export default function Messages({ messages}:{messages:[{author:string, content:string, createdOn:number, id:string}]}) {
   const{userData} = useAppContext()
    return (
       userData&& <>
        {messages.map((message) => {
            return (
                <div key={message.id} className={userData?.handle===message.author?'send-message':'received-message'}>
                    
                    <div className="message-header">
                    <p>{message.author===userData.handle?'You':message.author}</p>{/*potential bug*/}
                    <p>{new Date(message.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span>{message.content}</span>
                </div>
            )
        })}
        </>
    )
}