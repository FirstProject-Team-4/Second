import { useState } from "react"
import Button from "../../Button/Button"
import { addDislikeComment, addLikeComment, addReply, deleteComment, getPostById, removeDislikeComment, removeLikeComment } from "../../../Service/post-service"
import { useAppContext } from "../../../Context/AppContext"
import Reply from "../Reply/Reply"
import { ref, update } from "firebase/database"
import { db } from "../../../config/config-firebase"
import { NavLink } from "react-router-dom"
import './Comments.css'
import UserImage from "../UserImage/UserImage"

export default function Comments(prop: any) {

  const [replyIsActive, setReplyIsActive] = useState(false)
  const [comments, setComments] = useState(prop.comment)
  const [isEditing, setIsEditing] = useState(false)
  const { userData } = useAppContext();
  const [editedComment, setEditedComment] = useState(comments?.content)
  const { user } = useAppContext();



  const [reply, setReply] = useState('')
  const toggleReply = () => {
    setReplyIsActive(!replyIsActive)
  }
  const addCurrentReply = async () => {
    if (!user) {
      return alert('Login to reply');
    }
    if (userData.isBlock) {
      return alert('You are blocked');
    }
    if (reply.length < 1) {
      return;
    }
    await addReply(comments.id, comments.postId, userData.handle, reply, userData);

    getPostById(prop.comment.postId).then((value: any) => {

      setComments(value[0].comments.filter((c: any) => c.id === comments.id)[0])
    });
    setReplyIsActive(true);
    setReply('');

  };

  const toggleCommentLikes = async () => {
    if (!user) {
      return alert('Login to count your opinions');
    }
    if (userData.isBlock) {
      return alert('You are blocked');
    }
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
    prop.setFak(!prop.fak)
  }

  const toggleCommentDislikes = async () => {
    if (!user) {
      return alert('Login to count your opinions');
    }
    if (userData.isBlock) {
      return alert('You are blocked');
    }
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
    prop.setFak(!prop.fak)
  }

  const setLikeButtonColor = () => {
    if (comments?.likedBy?.includes(userData?.handle)) {
      return 'orange';
    }
    return '';
  }
  const setDislikeButtonColor = () => {
    if (comments?.dislikesBy?.includes(userData?.handle)) {
      return 'orange';
    }
    return '';
  }
  const deleteWindowPop = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatePost: { [key: string]: any } = {};
      updatePost[`/posts/${comments.postId}/commentsCount`] = prop.post.commentsCount - 1;
      update(ref(db), updatePost);

      deleteComment(comments.postId, comments.id);
      setReplyIsActive(false);
      setComments(null);
      prop.setFak(!prop.fak)

    }
  }
  const isEditOn = () => {
    setIsEditing(!isEditing)
  }
  const confirmEdit = () => {
    setIsEditing(false)
    const updatePost: { [key: string]: any } = {};
    updatePost[`/posts/${comments.postId}/comments/${comments.id}/content`] = editedComment;
    update(ref(db), updatePost);

    setComments({ ...comments, content: editedComment })


  }
  return (
    isEditing ?


      <div className="border-comment">
        <h3>{prop.comment.author}</h3>
        <span>{new Date(prop.comment.createdOn).toLocaleString()}</span>
        <input value={editedComment} type="text" name="comment" id="comment-input" onChange={(e) => {
          setEditedComment(e.target.value)
        }} />
        <Button onClick={confirmEdit}>Save</Button>
        <Button onClick={() => { setIsEditing(false) }}>Cancel</Button>
      </div>
      :
      comments &&

      <div className="border-comment">
        <div className="comment-container">
          <div className="header">
            <UserImage author={prop.comment.author}></UserImage>
            <div className="information">
              <NavLink to={`/profile/${prop.comment.author}`}>{prop.comment.author}</NavLink>
              <span>{new Date(prop.comment.createdOn).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <p>{comments.content}</p>
        <Button color={setLikeButtonColor()} onClick={toggleCommentLikes}>{comments?.likes}👍</Button>
        <Button color={setDislikeButtonColor()} onClick={toggleCommentDislikes}>{comments?.dislikes}👎</Button>
        <Button id='reply' onClick={toggleReply}>{comments.replyCounter} ↩</Button>
        {comments.author === userData?.handle && <Button onClick={isEditOn}>✎</Button>}
        {userData?.isAdmin === true ? <Button onClick={deleteWindowPop}>❌</Button> : comments.author === userData?.handle && <Button onClick={deleteWindowPop}>❌</Button>}
        {replyIsActive && <div>
          <input value={reply} type="text" name="comment" id="reply-input" onChange={e => setReply(e.target.value)} />
          <Button onClick={addCurrentReply} id="add-reply">Add Reply</Button>
        </div>}
        {replyIsActive && comments.replies && Object.values(comments.replies).map((r: any, index) => <Reply key={r.id ? r.id : index} reply={r} setCommends={setComments} comment={comments} />)}
      </div>


  )
}

