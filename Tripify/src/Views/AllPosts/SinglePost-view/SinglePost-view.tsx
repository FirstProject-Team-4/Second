import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PostType } from "../AllPosts-view/AllPosts";
import { addComment, getPostById } from "../../../Service/post-service";
import Post from "../../../Components/Post/Post/Post";
import Button from "../../../Components/Button/Button";
import { useAppContext } from "../../../Context/AppContext";
import Comments from "../../../Components/Post/Comments/Comments";
import { ref, update } from "firebase/database";
import { db } from "../../../config/config-firebase";
import DropdownMenu from "../../../Components/Button/DropdownMenu";
import './SinglePost-view.css'

/**
 * Renders a single post view.
 * 
 * @returns The JSX element representing the single post view.
 */
export default function SinglePostView() {
    const { id } = useParams()
    const [posts, setPosts] = useState<PostType[]>([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    const { userData, user } = useAppContext();
    const [fak, setFak] = useState(false);

    useEffect(() => {
        document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
        document.body.style.backgroundSize = 'contain';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        if (id) {
            (async () => {
                const post = await getPostById(id);
                setPosts(post || []);
                if (post) {
                    setComments(post[0].comments);
                }
            })();
        }
    }, [comment, fak]);



    /**
     * Adds a new comment to the single post view.
     * If the user is blocked, it displays an alert.
     * If the comment is empty, it does nothing.
     * Updates the comment count of the post.
     * Retrieves the updated comments for the post.
     * Clears the comment input field.
     */
    const addCurrentComment = async () => {
        if (userData?.isBlock) {
            return alert('You are blocked');
        }
        if (comment.length < 1) {
            return;
        }
        if (!user) {
            return alert('Login to count your opinions');
        }
        addComment(posts[0].id, userData, comment,);
        if (id) {
            const updatePost: { [key: string]: any } = {};

            updatePost[`/posts/${id}/commentsCount`] = posts[0].commentsCount + 1;
            posts[0].commentsCount++;
            update(ref(db), updatePost);
            const post = await getPostById(id);
            if (post && post[0]) {
                setComments(post[0].comments);
            }
        }
        setComment('');
    }

    return (
        posts[0] && <div>
            <h1>Post</h1>

            {posts[0] && <Post key={posts[0].id} post={posts[0]} setPosts={setPosts} ></Post>}
            <input value={comment} type="text" name="comment" id="comment-input" onChange={e => setComment(e.target.value)} />
            <Button onClick={addCurrentComment} id="add-comments" >Add Comment</Button>
            {posts[0] && <DropdownMenu array={comments} setArray={setComments} ></DropdownMenu>}
            <div>
                {comments && comments.map((c: any) => <Comments key={c.id} comment={c} fak={fak} setFak={setFak} post={posts[0]} />)}
            </div>
        </div>
    )
}
