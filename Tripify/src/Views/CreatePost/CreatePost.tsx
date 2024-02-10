import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Button from "../../Components/Button";
import { addPost } from "../../Service/post-service";
//· Each post must have a user who created it, a title, content, comments and how many likes it has received.

// o The title must be between 16 and 64 symbols.

// o The content must be between 32 symbols and 8192 symbols.

// o The post must have a user who created it.

// o Other users must be able to post replies.


export default function CreatePost() {

    const { userData } = useContext(AppContext);
    const [post, setPost] = useState({
        title: '',
        content: '',
        user: '',
        comments: '',
    });

    const updatePost = (value: string, key: string) => {
        setPost({
            ...post,
            [key]: value,
        });
    };



    const createPost = async () => {
        if (post.title.length < 16 || post.title.length > 64) {
            return alert('The title must be between 16 and 64 symbols.');
        }
        if (post.content.length < 32 || post.content.length > 8192) {
            return alert('The content must be between 32 symbols and 8192 symbols.');
        }
        // if (post.user === null || post.user === undefined || post.user === '') {
        //     return alert('The post must have a user who created it.');
        // }
        // if (post.comments === null || post.comments === undefined || post.comments === '') {
        //     return alert('Other users must be able to post replies.');
        // }

        await addPost(userData.handle, post.title, post.content);

        setPost({
            title: '',
            content: '',
            user: '',
            comments: '',
        });
    };

    return (
        <div>
            <h1>Create tweet</h1>
            <label htmlFor="input-title">Title:</label>
            <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type="text" name="input-title" id="input-title" /><br />
            <label htmlFor="input-content">Content:</label><br />
            <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name="input-content" id="input-content" cols={30} rows={10}></textarea><br /><br />
            <Button onClick={createPost}>Create</Button>
        </div>
    );
}