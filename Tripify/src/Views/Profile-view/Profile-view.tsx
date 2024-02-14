import { useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useEffect, useState } from "react";

import { getAllPostsByUser } from "../../Service/post-service";
import { PostType } from "../AllPosts/AllPosts";
import Post from "../../Components/Post/Post";
import { saveImage } from "../../Service/firebase-storage";
import { ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";
import { getUserByHandle } from "../../Service/user-service";


const Profile = () => {
    const { user,userData, setContext } = useAppContext();
    const [post, setPosts] = useState<PostType[]>([]);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getAllPostsByUser(id).then(setPosts);
        }
    }, [id]);

    const handleUploadClick = () => {
        document.getElementById('fileInput')?.click();
    }
    const handleFileSelect = (e: any) => {
        const file = e.target.files[0];
        saveImage(file).then((url) => {
            update(ref(db, `users/${userData.handle}`), { image: url });
   
          getUserByHandle(userData.handle).then((snapshot) => {
            if (snapshot.exists()) {
                setContext({ ...user, userData: snapshot.val() });
            }
        });});
       
    }

    return (

        post.length && <div>
            <h1>Profile</h1>
            <img src={userData?.image} alt="profile" />
            <input type="file" id="fileInput" accept="image/*"  style={{ display: 'none' }} onChange={handleFileSelect} />
            {userData?.handle === id && <span onClick={handleUploadClick}>upload image</span>}
            <h2>{post[0].author}</h2>
            {post.map((post) => (
                <Post key={post.id} post={post} setPosts={setPosts}></Post>))}

        </div>

    )
}
export default Profile;