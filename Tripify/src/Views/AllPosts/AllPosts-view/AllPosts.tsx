import { useEffect, useState } from "react";
import { getAllPosts } from "../../../Service/post-service";
import { useSearchParams } from "react-router-dom";
import Post from "../../../Components/Post/Post/Post";
import DropdownMenu from "../../../Components/Button/DropdownMenu";
import "./AllPosts.css";

export type PostType = {
    id: string;
    author: string;
    title: string;
    content: string;
    image: any;
    dislikes: number;
    likes: number;
    createdOn: string;
    dislikesBy: string[];
    likedBy: string[];
    imageUrl: string[];
    comments: string[];
    commentsCount: number;
    userImage: string;

};

export default function AllPosts() {
    const [posts, setPosts] = useState<PostType[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || '';

    const setSearch = (value: string) => {
        setSearchParams({ search: value });
    };

    useEffect(() => {
        getAllPosts(search).then(setPosts);
    }, [search]);
    return (
        <div>
            <h1>All posts</h1>


            <label htmlFor="search" className="search-label" >Search </label>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" className="search-view" placeholder="⌕ search... " /><br />

            {posts && <DropdownMenu array={posts} setArray={setPosts}></DropdownMenu>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post key={post.id} post={post} setPosts={setPosts}></Post>
                ))
            ) : (
                <p>No posts found</p>
            )}
        </div>
    );
}
