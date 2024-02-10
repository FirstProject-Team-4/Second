
import Button from '../Button';
import { likePost, dislikePost } from '../../Service/post-service';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';

export default function Post({ post, togglePostLike }: { post: { id: string, title: string, content: string, createdOn: string, liked: boolean }, togglePostLike: (handle: string, id: string) => void }) {
    const navigate = useNavigate(); // Declare the missing 'navigate' variable
    const { userData } = useAppContext(); // Declare the missing 'userData' variable

    const toggleLike = async () => {
        if (Array.isArray(post.liked) && post.liked.includes(userData!.handle)) {
            dislikePost(userData!.handle, post.id);
        } else {
            likePost(userData!.handle, post.id);
        }
        togglePostLike(userData!.handle, post.id);
    };

    return (
        <div className="post">
            <h4>{post.title} <Button onClick={toggleLike}>{Array.isArray(post.liked) && post.liked.includes(userData!.handle) ? 'Dislike' : 'Like'}</Button></h4>
            <p>{post.content}</p>
            <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Button onClick={() => navigate(`/posts/${post.id}`)}>View</Button> {/* Replace 'navigate' with 'navigator' */}
        </div>
    )
}

