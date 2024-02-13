import Button from "../Button";
import { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { addDislikeReply, addLikeReply, deleteReply, removeDislikeReply, removeLikeReply } from "../../Service/post-service";


export default function Reply(prop: { reply: { content: string, likes: number, dislikes: number, likedBy: string[], dislikesBy: string[], postId: string, commentId: string, id: string },setCommends:any }) {
  const [reply, setReply] = useState(prop.reply);
const {userData}=useAppContext();


  
const toggleReplyLikes = async () => {
    if (reply.dislikesBy?.includes(userData.handle)) {
        await removeDislikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.dislikes - 1);
    }
    if (reply.likedBy.includes(userData.handle)) {
        await removeLikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.likes - 1);
    } else {
        await addLikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.likes + 1);
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
        await removeLikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.likes - 1);
    }
    if (reply.dislikesBy.includes(userData.handle)) {
        await removeDislikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.dislikes - 1);
    } else {
        await addDislikeReply(userData.handle, reply.postId, reply.commentId,reply.id, reply.dislikes + 1);
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

          deleteReply(prop.reply.postId, prop.reply.commentId, prop.reply.id);
          
            prop.setCommends((comments:any)=>{
                let updatedPost = { ...comments };
                updatedPost.replies = updatedPost.replies.filter((r: any) => r.id !== prop.reply.id);
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
        return (
            reply &&
        <div style={{ border: '1px solid red' }}>
            <h1>{prop.reply.content}</h1>
            <Button color={setLikeButtonColor()} onClick={toggleReplyLikes}>{reply.likes}👍</Button>
            <Button color={setDislikeButtonColor()} onClick={toggleDisLikeReply}>{reply.dislikes}👎</Button>
            <Button onClick={deleteCurrentReply}>Delete</Button>
        </div>
    )
}
