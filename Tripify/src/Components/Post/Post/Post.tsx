
import Button from '../../Button/Button';
import { removeLike, addLike, removeDislike, addDislike, deletePost } from '../../../Service/post-service';
// import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../Context/AppContext';
import {  useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../../config/config-firebase';
import { NavLink} from 'react-router-dom';
import './Post.css';
import UserImage from '../UserImage/UserImage';



export default function Post({ post, setPosts }: {
    post: {
        id: string, userImage: string, commentsCount: number, author: string, title: string, content: string, image: any, dislikes: number,
        likes: number, createdOn: string, dislikesBy: string[], likedBy: string[]
    },
    setPosts: any
}) {

    const {user, userData } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({ title: post.title, content: post.content });
// const location=useLocation()



const handleShare = () => {
    const url = `${window.location.origin}/posts/${post.id}`
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copied to clipboard'))
      .catch(err => console.error('Could not copy text: ', err));
  };


    const isEditOn = () => {
 
        setIsEditing(!isEditing);
    }
    const confirmEdit = () => {
        setPosts((posts: any) => posts.map((p: any) => {
            if (p.id === post.id) {
                p.title = editedPost.title;
                p.content = editedPost.content;
            }
            return { ...p };
        }));
        setIsEditing(false);
        const updatePost: { [key: string]: any } = {};
        updatePost[`/posts/${post.id}/title/`] = editedPost.title;
        updatePost[`/posts/${post.id}/content/`] = editedPost.content;
        update(ref(db), updatePost);
    };
    const cancelEdit = () => {
        setIsEditing(false);
    }
    const toggleLike = async () => {
        if (!user) {
            return alert('Login to count your opinions');
          }
        if (userData.isBlock) {
            return alert('You are blocked');
          }
        if (post.dislikesBy?.includes(userData.handle)) {
            await removeDislike(userData.handle, post.id, post.dislikes - 1);
        }
        if (post.likedBy.includes(userData.handle)) {
            await removeLike(userData.handle, post.id, post.likes - 1);
        } else {
            await addLike(userData.handle, post.id, post.likes + 1);
        }
        setPosts((posts: any) => posts.map((p: any) => {
            if (p.id === post.id) {
                let updatedPost = { ...p };
                if (updatedPost.dislikesBy.includes(userData.handle)) {
                    updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
                    updatedPost.dislikes -= 1;
                }
                if (!updatedPost.likedBy.includes(userData.handle)) {
                    updatedPost.likedBy = [...p.likedBy, userData.handle];
                    updatedPost.likes += 1;
                } else {
                    updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
                    updatedPost.likes -= 1;
                }
                return updatedPost;
            }
            return p;
        }));
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
        if (!user) {
            return alert('Login to count your opinions');
          }
        if (userData.isBlock) {
            return alert('You are blocked');
          }
        if (post.likedBy?.includes(userData.handle)) {
            await removeLike(userData.handle, post.id, post.likes - 1);
        }
        if (post.dislikesBy.includes(userData.handle)) {
            await removeDislike(userData.handle, post.id, post.dislikes - 1);
        } else {
            await addDislike(userData.handle, post.id, post.dislikes + 1);
        }
        setPosts((posts: any) => posts.map((p: any) => {

            if (p.id === post.id) {
                let updatedPost = { ...p };
                if (updatedPost.likedBy.includes(userData.handle)) {
                    updatedPost.likedBy = updatedPost.likedBy.filter((u: string) => u !== userData.handle);
                    updatedPost.likes -= 1;
                }
                if (!updatedPost.dislikesBy.includes(userData.handle)) {
                    updatedPost.dislikesBy = [...updatedPost.dislikesBy, userData.handle];
                    updatedPost.dislikes += 1;
                } else {
                    updatedPost.dislikesBy = updatedPost.dislikesBy.filter((u: string) => u !== userData.handle);
                    updatedPost.dislikes -= 1;
                }
                return updatedPost;
            }
            return p;
        }));
    };
    const deleteWindowPop = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id);
            setPosts((posts: any) => posts.filter((p: any) => p.id !== post.id));


        } else {
            return;
        }
    }


    return (
        isEditing ?
        <div className="border">
                <label htmlFor="input-title">Title:</label>
                <input value={editedPost.title} onChange={e => setEditedPost({ ...editedPost, title: e.target.value })} type="text" name="input-title" id="input-title" /><br />
                <label htmlFor="input-content">Content:</label><br />
                <textarea value={editedPost.content} onChange={e => setEditedPost({ ...editedPost, content: e.target.value })} name="input-content" id="input-content" cols={30} rows={10}></textarea><br /><br />
                <Button onClick={confirmEdit}>Confirm</Button>
                <Button onClick={cancelEdit}>Cancel</Button>
            </div>
            :
            // <div className="post" style={{ border: '4px solid black' }}>
            <div className="border">
                <div className="post-container">
                    <div className="header">
                    <UserImage author={post.author}></UserImage>
                        <div className="information">
                            <NavLink to={`/profile/${post.author}`}>{post.author}</NavLink>
                        </div>
                    </div>
                </div>
                <h4>{post.title} </h4>
                <p className='content'>{post.content}</p>
                {post.image && <img  src={post.image} alt="post"  className='img-post'/>}
                <p className='date'>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
                <Button color={setLikeButtonColor()} onClick={toggleLike} id='like-button'>{post.likes}👍</Button>
                <Button color={setDislikeButtonColor()} onClick={toggleDislike} id='dislike-button'>{post.dislikes}👎</Button>
                {post.author === userData?.handle && <Button onClick={isEditOn} id='edit-button'>✎</Button>}
                {/* Comments */}
                <Button onClick={handleShare} id='link'>🔗</Button>
                <NavLink to={`/posts/${post.id}`}>{post.commentsCount} 💬</NavLink>
                {userData?.isAdmin===true? <Button id='delete' onClick={deleteWindowPop}>❌</Button>:post.author === userData?.handle && <Button onClick={deleteWindowPop}>❌</Button>}


            </div>
    )
}

