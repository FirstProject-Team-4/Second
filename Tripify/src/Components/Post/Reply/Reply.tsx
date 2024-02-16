import Button from "../../Button/Button";
import { useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { addDislikeReply, addLikeReply, deleteReply, removeDislikeReply, removeLikeReply } from "../../../Service/post-service";
import { db } from "../../../config/config-firebase";
import { ref, update } from 'firebase/database';
import { NavLink } from "react-router-dom";
import './Reply.css';

export default function Reply(prop: { reply: { content: string,author:string, createdOn:string, likes: number,userImage:string, dislikes: number, likedBy: string[], dislikesBy: string[], postId: string, commentId: string, id: string }, setCommends: any , comment: any}) {
    const [reply, setReply] = useState(prop.reply);
    const { userData } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedReply, setEditedReply] = useState(reply.content);


    const toggleReplyLikes = async () => {
        if (reply.dislikesBy?.includes(userData.handle)) {
            await removeDislikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.dislikes - 1);
        }
        if (reply.likedBy.includes(userData.handle)) {
            await removeLikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.likes - 1);
        } else {
            await addLikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.likes + 1);
        }
        setReply((reply: any) => {
            let updatedPost = { ...reply };
            if (updatedPost.dislikesBy.includes(userData.handle)) {
                updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
                updatedPost.dislikes -= 1;
            }
            if (!updatedPost.likedBy.includes(userData.handle)) {
                updatedPost.likedBy = [...reply.likedBy, userData.handle];
                updatedPost.likes += 1;
            } else {
                updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
                updatedPost.likes -= 1;
            }
            return updatedPost;
        });
    }

    const toggleDisLikeReply = async () => {


        if (reply.likedBy?.includes(userData.handle)) {
            await removeLikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.likes - 1);
        }
        if (reply.dislikesBy.includes(userData.handle)) {
            await removeDislikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.dislikes - 1);
        } else {
            await addDislikeReply(userData.handle, reply.postId, reply.commentId, reply.id, reply.dislikes + 1);
        }
        setReply((reply: any) => {
            let updatedPost = { ...reply };
            if (updatedPost.likedBy.includes(userData.handle)) {
                updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
                updatedPost.likes -= 1;
            }
            if (!updatedPost.dislikesBy.includes(userData.handle)) {
                updatedPost.dislikesBy = [...reply.dislikesBy, userData.handle];
                updatedPost.dislikes += 1;
            } else {
                updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
                updatedPost.dislikes -= 1;
            }
            return updatedPost;
        });
    }

    const deleteCurrentReply = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {

            console.log(prop.comment.replyCounter);
            const updatePost: { [key: string]: any } = {};
            updatePost[`/posts/${reply.postId}/comments/${reply.commentId}/replyCounter`] = prop.comment.replyCounter - 1;
    
            update(ref(db),updatePost);
            deleteReply(prop.reply.postId, prop.reply.commentId, prop.reply.id);

            prop.setCommends((comments: any) => {
                let updatedPost = { ...comments };
                updatedPost.replies = updatedPost.replies.filter((r: any) => r.id !== prop.reply.id);
                updatedPost.replyCounter -= 1;
                return updatedPost;
            });
            setReply(null as any);
        }
    }
    const setLikeButtonColor = () => {
        if (reply.likedBy?.includes(userData?.handle)) {
            return 'orange';
        }
        return '';
    }
    const setDislikeButtonColor = () => {
        if (reply.dislikesBy?.includes(userData?.handle)) {
            return 'orange';
        }
        return '';
    }
    const isEdinOn = () => {
        setIsEditing(!isEditing);
    }

    const confirmEdit = () => {
        const updateReply: {[key: string]: any} = {};
        updateReply[`/posts/${reply.postId}/comments/${reply.commentId}/replies/${reply.id}/content`] = editedReply;
        update(ref(db), updateReply);
       
      
        prop.setCommends((comments: any) => {
            let updatedPost = { ...comments };
            updatedPost.replies = updatedPost.replies.map((r: any) => {
                if (r.id === reply.id) {
                    r.content = editedReply;
                }
                return r;
            });
            return updatedPost;
        });

        setIsEditing(false);
        setReply({...reply, content: editedReply});
      };
    return (
        isEditing ?
        <div style={{ border: '2px solid green' }}>
          <NavLink to={`/profile/${reply.author}`}>{reply.author}</NavLink>
        <span>{new Date(reply.createdOn).toLocaleString()}</span>
        <input value={editedReply} type="text" name="comment" id="comment-input" onChange={(e) => {
          setEditedReply(e.target.value) }} />
        <Button onClick={confirmEdit}>Save</Button>
        <Button onClick={() => { setIsEditing(false) }}>Cancel</Button>
        
      </div>
      :
        reply &&
        <div style={{ border: '1px solid red' }}>
        <div className="comment-container">
        <div className="header">
        {reply?.userImage?.length>1&&<img src={reply.userImage} className="img" alt="profile" />||<span className="letter">{reply?.author[0]}</span>}
        <div className="information">
        <NavLink to={`/profile/${reply.author}`}>{reply.author}</NavLink>
        <span>{new Date(reply.createdOn).toLocaleString()}</span>
        </div>
        </div>
        </div>
            <h1>{prop.reply.content}</h1>
            <Button color={setLikeButtonColor()} onClick={toggleReplyLikes}>{reply.likes}👍</Button>
            <Button color={setDislikeButtonColor()} onClick={toggleDisLikeReply}>{reply.dislikes}👎</Button>
            {userData?.isAdmin===true? <Button onClick={deleteCurrentReply}>❌</Button>:reply.author === userData?.handle && <Button onClick={deleteCurrentReply}>❌</Button>}
           {reply.author===userData.handle&&<Button onClick={isEdinOn}>✎</Button>}
            

        </div>
    )
}
