import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PostType } from "./AllPosts";
import { addComment, getPostById } from "../../Service/post-service";
import Post from "../../Components/Post/Post/Post";
import Button from "../../Components/Button/Button";
import { useAppContext } from "../../Context/AppContext";
import Comments from "../../Components/Post/Comments/Comments";
import { ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";
import DropdownMenu from "../../Components/Button/DropdownMenu";


export default function SinglePostView() {
    const { id } = useParams()
    const [posts, setPosts] = useState<PostType[]>([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    const { userData } = useAppContext();

    useEffect(() => {
        if (id) {
            (async () => {
                const post = await getPostById(id);
                setPosts(post || []);
                if(post){
                     setComments(post[0].comments);
                    console.log(post[0].comments);
                }
            })();
        }
    }, [comment]);
    
    

    const addCurrentComment = async() => {
        if (userData.isBlock) {
            return alert('You are blocked');
          }
        if (comment.length < 1) {
            return;
        }
        addComment(posts[0].id, userData, comment,);
        if(id){
            const updatePost: { [key: string]: any } = {};
   
            updatePost[`/posts/${id}/commentsCount`] = posts[0].commentsCount + 1;
            posts[0].commentsCount++;
            update(ref(db),updatePost);
            const post = await getPostById(id);
            if(post && post[0]){ 
                setComments(post[0].comments);
              
            }
        }
        setComment('');
           
     
    }
        return (
           posts[0]&& <div>
                <h1>Post</h1>

                {posts[0] && <Post key={posts[0].id} post={posts[0]} setPosts={setPosts} ></Post>}
                <input value={comment} type="text" name="comment" id="comment-input" onChange={e => setComment(e.target.value)} />
                <Button onClick={addCurrentComment}>Add Comment</Button>
                {posts[0]  && <DropdownMenu array={comments} setArray={setComments}></DropdownMenu>}
                <div>
                    {comments && comments.map((c: any) => <Comments key={c.id}  comment={c} setPosts={setPosts} post={posts[0]} />)}
                </div>
            </div>
        )
    }
