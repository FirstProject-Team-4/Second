
import Button from '../Button';
import { likePost, dislikePost } from '../../Service/post-service';
// import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';

export default function Post({ post, togglePostLike }: { post: { id: string, title: string, content: string, createdOn: string, likedBy:[string] }, togglePostLike: (handle: string, id: string) => void }) {
   
    const { userData } = useAppContext(); // Declare the missing 'userData' variable

    const toggleLike = async () => {
        if (post.likedBy.includes(userData.handle)) {
            await dislikePost(userData!.handle, post.id);
        } else {
            await likePost(userData!.handle, post.id);
        }
        togglePostLike(userData!.handle, post.id);
    };

    return (
        <div className="post">
            <h4>{post.title} <Button onClick={toggleLike}>{post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}</Button></h4>
            <p>{post.content}</p>
            <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
        </div>
    )
}

