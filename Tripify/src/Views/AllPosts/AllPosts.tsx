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
    }, [search]);

    const togglePostLike = (handle: string, id: string) => {
        setPosts(posts.map((post) => {
            if (post.id === id) {
                post.likedBy = post.likedBy.includes(handle) ? post.likedBy.filter((u: string) => u !== handle) : [...post.likedBy, handle];
            }
            return post;
        }));
    };

    return (
        <div>
            <h1>All posts</h1>
                <label htmlFor="search">Search </label>
                <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/>
                {posts.map((post) => (
                    <Post key={post.id} post={post} togglePostLike={togglePostLike}/>
                ))}
        </div>
    );
}
