
import Button from '../Button';
import { removeLike, addLike, removeDislike, addDislike, deletePost } from '../../Service/post-service';
// import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import Comments from './Comments';
import { useState } from 'react';

export default function Post({ post, likeCurrentPost, dislikeCurrentPost,deleteCurrentPost }: {
    post: { id: string,author:string, title: string, content: string,image:any, dislikes: number, likes: number, createdOn: string,  dislikesBy: [string],likedBy: [string] },
    dislikeCurrentPost: (handle: string, id: string) => void,
    likeCurrentPost: (handle: string, id: string) => void
    deleteCurrentPost:(id:string)=>void
}) {

    const { userData } = useAppContext();
 const [showComments, setShowComments] = useState(false);
    const toggleLike = async () => {
        if(post.dislikesBy?.includes(userData.handle)){
            await removeDislike(userData.handle, post.id, post.dislikes-1);
        }
        if (post.likedBy.includes(userData.handle)) {
            await removeLike(userData.handle, post.id, post.likes - 1);
        } else {
            await addLike(userData.handle, post.id, post.likes + 1);
        }
        likeCurrentPost(userData.handle, post.id);
    };

    const setLikeButtonColor = () => {
        if (post.likedBy?.includes(userData?.handle)) {
            return 'orange';
        }
        return '';
    }
    const setDislikeButtonColor = () => {
        if (post.dislikesBy?.includes(userData?.handle)) {
            return 'orange';
        }
        return '';
    }

    const toggleDislike = async () => {
        if(post.likedBy?.includes(userData.handle)){
            await removeLike(userData.handle, post.id, post.likes-1);
        }
        if (post.dislikesBy.includes(userData.handle)) {
            await removeDislike(userData.handle, post.id, post.dislikes - 1);
        } else {
            await addDislike(userData.handle, post.id, post.dislikes + 1);
        }
        dislikeCurrentPost(userData.handle, post.id);
    };
    const deleteWindowPop=()=>{
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id);
            deleteCurrentPost(post.id)
            
        } else {
            return;
        }
    }

    return (
        <div className="post" style={{ border: '4px solid black' }}>
            <h4>{post.title} </h4>
            <p>{post.content}</p>
            {post.image&&<img src={post.image} alt="post" />}
            <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Button color={setLikeButtonColor()} onClick={toggleLike}>{post.likes}👍</Button>
            <Button color={setDislikeButtonColor()} onClick={toggleDislike}>{post.dislikes}👎</Button>
            {post.author === userData?.handle && <Button onClick={() => { }}>Edit</Button>}  /*Todo**/
            {post.author === userData?.handle && <Button onClick={() => { }}>Delete</Button>}/*Todo**/
            {/* Comments */}
            <button onClick={() => setShowComments(!showComments)}>Comments</button> 
            {showComments && <Comments postId={post.id} />} 
            {post.author === userData?.handle && <Button onClick={deleteWindowPop}>Delete</Button>}
        </div>
    )
}

