import { useState } from "react"
import Button from "../Button"
import { addDislikeComment, addLikeComment, addReply, removeDislikeComment, removeLikeComment } from "../../Service/post-service"
import { useAppContext } from "../../Context/AppContext"
import Reply from "./Reply"

export default function Comments(prop: any) {

  const [replyIsActive, setReplyIsActive] = useState(false)
  const [comments, setComments] = useState(prop.comment)

  const { userData } = useAppContext();

  const [reply, setReply] = useState('')
  const toggleReply = () => {
    setReplyIsActive(!replyIsActive)
  }
  const addCurrentReply = async () => {

    await addReply(comments.id, comments.postId, userData.handle, reply)
    setComments((comments: any) => {
      let updatedComments = { ...comments };
      updatedComments.replies = { ...comments.replies, [new Date().getTime()]: { author: userData.handle, content: reply, createdOn: new Date().getTime() } };
      return updatedComments;
    })
    setReply('')
  }

  const toggleCommentLikes = async () => {

    if (comments.dislikesBy?.includes(userData.handle)) {
      await removeDislikeComment(userData.handle, comments.postId, comments.id, comments.dislikes - 1);
    }
    if (comments.likedBy.includes(userData.handle)) {
      await removeLikeComment(userData.handle, comments.postId, comments.id, comments.likes - 1);
    } else {
      await addLikeComment(userData.handle, comments.postId, comments.id, comments.likes + 1);
    }
    setComments((comments: any) => {
      let updatedPost = { ...comments };
      if (updatedPost.dislikesBy.includes(userData.handle)) {
        updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
        updatedPost.dislikes -= 1;
      }
      if (!updatedPost.likedBy.includes(userData.handle)) {
        updatedPost.likedBy = [...comments.likedBy, userData.handle];
        updatedPost.likes += 1;
      } else {
        updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
        updatedPost.likes -= 1;
      }
      return updatedPost;
    });
  }

  const toggleCommentDislikes = async () => {
    if (comments.likedBy.includes(userData.handle)) {
      await removeLikeComment(userData.handle, comments.postId, comments.id, comments.likes - 1);
    }
    if (comments.dislikesBy.includes(userData.handle)) {
      await removeDislikeComment(userData.handle, comments.postId, comments.id, comments.dislikes - 1);
    } else {
      await addDislikeComment(userData.handle, comments.postId, comments.id, comments.dislikes + 1);
    }

    setComments((comments: any) => {
      let updatedPost = { ...comments };
      if (updatedPost.likedBy.includes(userData.handle)) {
        updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
        updatedPost.likes -= 1;
      }
      if (!updatedPost.dislikesBy.includes(userData.handle)) {
        updatedPost.dislikesBy = [...comments.dislikesBy, userData.handle];
        updatedPost.dislikes += 1;
      } else {
        updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
        updatedPost.dislikes -= 1;
      }
      return updatedPost;
    });
  }

  const setLikeButtonColor = () => {
    if (comments.likedBy?.includes(userData?.handle)) {
      return 'orange';
    }
    return '';
  }
  const setDislikeButtonColor = () => {
    if (comments.dislikesBy?.includes(userData?.handle)) {
      return 'orange';
    }
    return '';
  }

  return (
    <div style={{ border: '2px solid green' }}>
      <h3>{prop.comment.author}</h3>
      <span>{new Date(prop.comment.createdOn).toLocaleString()}</span>
      <p>{prop.comment.content}</p>
      <Button color={setLikeButtonColor()} onClick={toggleCommentLikes}>{comments.likes}👍</Button>
      <Button color={setDislikeButtonColor()} onClick={toggleCommentDislikes}>{comments.dislikes}👎</Button>
      <Button onClick={toggleReply}>Reply</Button>
      {replyIsActive && <div>
        <input value={reply} type="text" name="comment" id="comment-input" onChange={e => setReply(e.target.value)} />
        <Button onClick={addCurrentReply}>Add Reply</Button>
      </div>}
      {replyIsActive && comments.replies && Object.values(comments.replies).map((r: any, index) => <Reply key={r.id ? r.id : index} reply={r} />)}
    </div>
  )
}
