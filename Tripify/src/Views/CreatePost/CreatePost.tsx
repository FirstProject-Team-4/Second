import {  useState } from "react";
// import { AppContext } from "../../Context/AppContext";
import Button from "../../Components/Button";
import { addPost } from "../../Service/post-service";
import { useAppContext } from "../../Context/AppContext";
// import { set } from "firebase/database";



export default function CreatePost() {

    const { userData } = useAppContext();
    const [post, setPost] = useState({
        title: '',
        content: '',
        user: '',
        comments: '',
        image: '',
    });

   
    // const [image, setImage] = useState(null); // New state variable for the image

    const updatePost = (value: string, key: string) => {
        setPost({
          ...post,
          [key]: value,
        });
      };
      const updateImage = (value: any, key: string) => {
        console.log(value);
        if (!value) {
          return;
        } 
       const image=URL.createObjectURL(value[0]);
       console.log(image);
        setPost({
          ...post,
          [key]: image,
        });
      }
    
    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { // New handler for image upload
    //    setPost()
    // };
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
//post.comments, image
       await addPost(userData.handle, post.title, post.content,post.image); // Pass the image to the service function

        setPost({
            title: '',
            content: '',
            user: '',
            image: '',
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
            <label htmlFor="input-image">Image:</label>
      <input id="input-image" type="file"  onChange={e => updateImage(e.target.files , 'image')} /><br />
            <Button onClick={createPost}>Create</Button>
        </div>
    );
}