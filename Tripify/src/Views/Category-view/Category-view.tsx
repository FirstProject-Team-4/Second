import { useParams } from "react-router-dom"
import { PostType } from "../AllPosts/AllPosts-view/AllPosts";
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
    }
  }, [categoryName]);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
  }, []);

  return (

    posts && <div>
      {posts.length >= 1 && <DropdownMenu array={posts} setArray={setPosts} />}
      {posts.map((post: any) => (
        <Post key={post.id} post={post} setPosts={setPosts}></Post>
      ))}
    </div>
  );
}