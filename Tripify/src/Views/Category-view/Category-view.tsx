import { useParams } from "react-router-dom"
import './Category-view.css'
import { PostType } from "../AllPosts/AllPosts";
import { useEffect, useState } from "react";
import { getPostsByCategory } from "../../Service/post-service";
import Post from "../../Components/Post/Post/Post";
import DropdownMenu from "../../Components/Button/DropdownMenu";

export default function CategoryView() {
    const { categoryName } = useParams()
    const [posts, setPosts] = useState<PostType[]>([]);
useEffect(() => {
    if (categoryName) {
        getPostsByCategory(categoryName).then(setPosts);
    }},[categoryName]);
    return (
      
      posts&&<div>
        {posts.length>=1 && <DropdownMenu array={posts} setArray={setPosts} />}
        {posts.map((post: any) => (
          <Post key={post.id} post={post} setPosts={setPosts}></Post>
        ))}
      </div>
    );
}