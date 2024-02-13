import { useEffect, useState } from "react"
import Button from "../Button"
import { addReply } from "../../Service/post-service"
import { useAppContext } from "../../Context/AppContext"
import Reply from "./Reply"

export default function Comments(prop: any) {

  const [replyIsActive, setReplyIsActive] = useState(false)
  const [comments,setComments] = useState(prop.comment)

  const { userData } = useAppContext();

  const [reply, setReply] = useState('')
  const toggleReply = () => {
    setReplyIsActive(!replyIsActive)
  }
  const addCurrentReply = async() => {

   await addReply(comments.id, comments.postId, userData.handle, reply)
    setComments((comments:any)=>{
      let updatedComments = {...comments};
      updatedComments.replies = {...comments.replies, [new Date().getTime()]:{author:userData.handle,content:reply,createdOn:new Date().getTime()}};
      return updatedComments;
    })
    setReply('')
    

  }
  return (
    <div style={{ border: '2px solid green' }}>
      <h3>{prop.comment.author}</h3>
      <span>{new Date(prop.comment.createdOn).toLocaleString()}</span>
      <p>{prop.comment.content}</p>
      <button>Like</button>Todo
      <button>Dislike</button>Todo
      <Button onClick={toggleReply}>Reply</Button>
      {replyIsActive && <div>
        <input value={reply} type="text" name="comment" id="comment-input" onChange={e => setReply(e.target.value)} />
        <Button onClick={addCurrentReply}>Add Reply</Button>
      </div>}
      {replyIsActive&&comments.replies && Object.values(comments.replies).map((r: any,index) => <Reply key={r.id?r.id:index} reply={r} />)}
    </div>
  )
}
