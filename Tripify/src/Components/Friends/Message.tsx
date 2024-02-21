import { useAppContext } from "../../Context/AppContext"
import './Message.css'

/**
 * Renders a list of messages.
 * 
 * @param messages - An array of message objects.
 * @param messages.author - The author of the message.
 * @param messages.content - The content of the message.
 * @param messages.createdOn - The timestamp when the message was created.
 * @param messages.id - The unique identifier of the message.
 * @returns The rendered list of messages.
 */
export default function Messages({ messages }: { messages: { author: string, content: string, createdOn: number, id: string }[] }) {
    const { userData } = useAppContext();

    return (
        userData && <>
            {messages.map((message) => {
                return (
                    <div key={message.id} className={userData?.handle === message.author ? 'send-message' : 'received-message'}>

                        <div className="message-header">
                            <p>{message.author === userData.handle ? 'You' : message.author}</p>{/*potential bug*/}
                            <p>{new Date(message.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span>{message.content}</span>
                    </div>
                )
            })}
        </>
    )
}