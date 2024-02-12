import { useEffect, useState } from "react";
import { getAllPosts } from "../../Service/post-service";
import { useSearchParams } from "react-router-dom";
import Post from "../../Components/Post/Post"; 


export default function AllPosts() {
    const [posts, setPosts] = useState<any[]>([]);
  
    const [searchParams, setSearchParams] = useSearchParams();


    const search = searchParams.get('search') || '';

    const setSearch = (value: string) => {
        setSearchParams({search: value});
    };

    useEffect(() => {
        getAllPosts(search).then(setPosts);
    },[search] );
    

    // const togglePostLike = (handle: string, id: string) => {
    //     setPosts(posts.map((post) => {
    //         if (post.id === id) {
    //             post.likedBy = post.likedBy.includes(handle) ? post.likedBy.filter((u: string) => u !== handle) : [...post.likedBy, handle];
    //         }
    //         return post;
    //     }));
    // };
    const likeCurrentPost = (handle: string, id: string) => {
        setPosts(posts.map((post) => {
            if (post.id === id ) {
                if(post.dislikesBy.includes(handle)){
                    post.dislikesBy = post.dislikesBy.filter((u: string) => u !== handle);
                    post.dislikes-=1;
                }
                if(!post.likedBy.includes(handle)){
                post.likedBy = [...post.likedBy, handle];
                post.likes+=1;
                }else{
                    post.likedBy = post.likedBy.filter((u: string) => u !== handle);
                    post.likes-=1;
                }
            }
            return post;
        }));
    }
    const dislikeCurrentPost = (handle: string, id: string) => {
        setPosts(posts.map((post) => {
            if (post.id === id ) {
                if(post.likedBy.includes(handle)){
                    post.likedBy = post.likedBy.filter((u: string) => u !== handle);
                    post.likes-=1;
                }
                if(!post.dislikesBy.includes(handle)){
                post.dislikesBy = [...post.dislikesBy, handle];
                post.dislikes+=1;
                }else{
                    post.dislikesBy = post.dislikesBy.filter((u: string) => u !== handle);
                    post.dislikes-=1;
                }
            }
            return post;
        }));
    }
    const deleteCurrentPost=(id:string)=>{
        setPosts(posts.filter(p=>p.id!==id))
    }

    return (
        <div>
            <h1>All posts</h1>
                <label htmlFor="search">Search </label>
                <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/>
                {posts.map((post) => (
                    <Post key={post.id} post={post} 
                    likeCurrentPost={likeCurrentPost} 
                    dislikeCurrentPost={dislikeCurrentPost}
                    deleteCurrentPost={deleteCurrentPost}/>
                ))}
        </div>
    );
}
