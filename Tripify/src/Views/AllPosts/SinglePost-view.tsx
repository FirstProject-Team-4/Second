import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PostType } from "./AllPosts";
import { addComment, getPostById } from "../../Service/post-service";
import Post from "../../Components/Post/Post";
import Button from "../../Components/Button";
import { useAppContext } from "../../Context/AppContext";
import Comments from "../../Components/Post/Comments";
import { ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";


export default function SinglePostView() {
    const { id } = useParams()
    const [posts, setPosts] = useState<PostType[]>([]);
    const [comment, setComment] = useState('')
    const { userData } = useAppContext();

    useEffect(() => {
        if (id) {
            getPostById(id).then((value: any) => setPosts(value));
        }
    }, [posts])

    const addCurrentComment = () => {
        if (comment.length < 1) {
            return;
        }
        addComment(posts[0].id, userData, comment,);
        if(id){
            const updatePost: { [key: string]: any } = {};
            updatePost[`/posts/${id}/commentsCount`] = posts[0].commentsCount + 1;
            update(ref(db),updatePost);
            getPostById(id).then((value: any) => setPosts(value));
        }
        setComment('');
           
     
    }
        return (
            <div>
                <h1>Post</h1>

                {posts[0] && <Post key={posts[0].id} post={posts[0]} setPosts={setPosts} ></Post>}
                <input value={comment} type="text" name="comment" id="comment-input" onChange={e => setComment(e.target.value)} />
                <Button onClick={addCurrentComment}>Add Comment</Button>
                <div>
                    {posts[0]?.comments && posts[0].comments.map((c: any) => <Comments key={c.id}  comment={c} setPosts={setPosts} post={posts[0]} />)}
                </div>
            </div>
        )
    }
    console.log('SinglePostView.tsx')