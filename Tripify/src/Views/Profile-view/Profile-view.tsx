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
    const { userData } = useAppContext();
    const [post, setPosts] = useState<PostType[]>([]);
    const [currentUser, setCurrentUser] = useState(null as any);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
        getUserByHandle(id).then((snapshot) => {
            if (snapshot.exists()) {
                setCurrentUser(snapshot.val());
            }
        });
       
            getAllPostsByUser(id).then(setPosts);
        }
    }, [id,currentUser]);

    const handleUploadClick = async () => {
        document.getElementById('fileInput')?.click();
    }
    const handleFileSelect = async(e: any) => {
        const file = e.target.files[0];
        const url=await saveImage(file)
        const updatePost: { [key: string]: any } = {};
       
       const posts=await getAllPostsByUser(currentUser.handle);
       posts.map((p:any)=>{
              updatePost[`/posts/${p.id}/userImage`] = url;
              update(ref(db), updatePost);
         });
         
        
         updatePost[`/users/${userData.handle}/userImage`] = url;
         update(ref(db), updatePost)
         setCurrentUser({...currentUser,userImage:url});

    }

    return (

        currentUser&& <div>
            <h1>Profile</h1>
            {currentUser.userImage&&<img src={currentUser?.userImage} style={{height:'200px',width:'300px'}} alt="profile" />}
            {!currentUser.userImage&&<span>{currentUser.handle[0]}</span>}
            <input type="file" id="fileInput" accept="image/*"  style={{ display: 'none' }} onChange={handleFileSelect} /><br></br>
            {userData?.handle === id && <span onClick={handleUploadClick}>upload image</span>}
            {post&&<h2>{currentUser.handle}</h2>}
            {post&&post.map((post) => (
                <Post key={post.id} post={post} setPosts={setPosts}></Post>))}

        </div>

    )
}
export default Profile;