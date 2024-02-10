
import Button from '../Button';
import { likePost, dislikePost } from '../../Service/post-service';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';

export default function Post({ post, togglePostLike }: { post: { id: string, title: string, content: string, createdOn: string, liked: boolean }, togglePostLike: (handle: string, id: string) => void }) {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    const toggleLike = async () => {
        if (post.liked.includes(userData!.handle)) {
            dislikePost(userData!.handle, post.id);
        } else {
            likePost(userData!.handle, post.id);
        }
        togglePostLike(userData!.handle, post.id);
    };

    return (
        <div className="post">
            <h4>{post.title} <Button onClick={toggleLike}>{post.liked.includes(userData!.handle) ? 'Dislike' : 'Like'}</Button></h4>
            <p>{post.content}</p>
            <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Button onClick={() => navigate(`/posts/${post.id}`)}>View</Button>
        </div>
    )
}

