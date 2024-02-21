import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useEffect, useState } from "react";
import { getAllPostsByUser } from "../../Service/post-service";
import { PostType } from "../AllPosts/AllPosts-view/AllPosts";
import Post from "../../Components/Post/Post/Post";
import { saveImage } from "../../Service/firebase-storage";
import { push, ref, update } from "firebase/database";
import { db } from "../../config/config-firebase";
import { getUserByHandle } from "../../Service/user-service";
import './Profile-view.css';
import Button from "../../Components/Button/Button";
import DropdownMenu from "../../Components/Button/DropdownMenu";
import { combineId, removeFriend } from "../../Service/friends-service";

const Profile = () => {
    const { user, userData, setContext } = useAppContext();
    const [post, setPosts] = useState<PostType[]>([]);
    const [currentUser, setCurrentUser] = useState(null as any);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bio, setBio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [requestFriends, setFriendsRequest] = useState([] as any | undefined);
    const [friends, setFriends] = useState([] as any | undefined);


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getUserByHandle(id).then((snapshot) => {
                if (snapshot.exists()) {
                    setCurrentUser(snapshot.val());
                }
                else {
                    navigate('/home');
                }
            });

            getAllPostsByUser(id).then(setPosts);
        }

        if (currentUser?.friendsRequest) {
            const currentValue = Object.values(currentUser.friendsRequest).map((value: any) => { return value.handle }

            )
            setFriendsRequest(currentValue);
        }
        if (currentUser?.friends) {
            const currentValue = Object.values(currentUser.friends).map((value: any) => { return value.handle }
            )
            setFriends(currentValue);
        }
    }, [id, userData]);

    useEffect(() => {
        document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
        document.body.style.backgroundSize = 'contain';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
    }, []);

    const handleUploadClick = async () => {
        document.getElementById('fileInput')?.click();
    }

    const handleFileSelect = async (e: any) => {
        const file = e.target.files[0];
        const url = await saveImage(file)
        const updatePost: { [key: string]: any } = {};
        updatePost[`/users/${userData.handle}/userImage`] = url;
        await update(ref(db), updatePost)

        setContext({ ...user, userData: { ...userData, userImage: url } })

    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const updatePost: { [key: string]: any } = {};
        updatePost[`/users/${userData.handle}/firstName`] = firstName;
        updatePost[`/users/${userData.handle}/lastName`] = lastName;
        updatePost[`/users/${userData.handle}/phoneNumber`] = phoneNumber;
        updatePost[`/users/${userData.handle}/bio`] = bio;
        update(ref(db), updatePost)
        setCurrentUser({ ...currentUser, firstName, lastName, phoneNumber, bio });
        setContext({ ...user, userData: { ...userData, firstName, lastName, phoneNumber, bio } })

        setShowEdit(false);
        setErrorMessage('');

    }
    const loadUserProfile = () => {
        setFirstName(currentUser.firstName);
        setLastName(currentUser.lastName);
        setPhoneNumber(currentUser.phoneNumber);
        setBio(currentUser.bio);

        setShowEdit(!showEdit);
    }

    const handelBlock = () => {
        if (currentUser?.isBlock) {
            const updatePost: { [key: string]: any } = {};
            updatePost[`/users/${currentUser.handle}/isBlock`] = false;
            update(ref(db), updatePost)
            setCurrentUser({ ...currentUser, isBlock: false });
        } else {
            const updatePost: { [key: string]: any } = {};
            updatePost[`/users/${currentUser.handle}/isBlock`] = true;
            update(ref(db), updatePost)
            setCurrentUser({ ...currentUser, isBlock: true });
        }
    }

    const toggleBlock = () => {
        if (currentUser?.isBlock) {
            return 'Unblock';
        } else {
            return 'Block';
        }
    }

    const friendsRequest = () => {
        const path = `/users/${currentUser.handle}/friendsRequest/`
        const newRequest = {
            handle: userData.handle,
            uid: userData.uid,
        }
        push(ref(db, path), newRequest)
        setFriendsRequest([...requestFriends, userData.handle]);
    }
    const removeCurrentFriend = () => {
        removeFriend(currentUser.handle, userData.handle);
        setFriends(friends?.filter((friend: any) => friend !== userData.handle));
        update(ref(db), { [`/chat/${combineId(userData.uid, currentUser.uid)}`]: null });
        setContext({ ...user, userData: { ...userData, friends: friends?.filter((friend: any) => friend !== userData.handle) } })


    }



    return (

        currentUser && <div>
            <h1>Profile</h1>
            <div className="prpfile-container">
                <div className="img-container">
                    {currentUser.userImage && <img src={currentUser?.userImage} className="img-view" alt="profile" />}
                    {!currentUser.userImage && <span className="letter-view">{currentUser.handle[0]}</span>}
                    <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} /><br></br>
                    {userData?.handle === id && <span onClick={handleUploadClick} className="button-profile">upload image</span>}
                    {userData?.handle === id && <button onClick={loadUserProfile} className="button-profile">Edit✎</button>}
                </div>
                {showEdit ? (
                    <form onSubmit={handleSubmit}>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <label>
                            First Name:
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </label><br></br>
                        <label>
                            Last Name:
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </label><br></br><br></br>
                        <label>
                            Phone Number:
                            <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                        </label><br></br><br></br>
                        <label> Bio:  <textarea value={bio} onChange={e => setBio(e.target.value)} />
                        </label><br></br><br></br>
                        <input type="submit" value="Submit" />
                    </form>
                ) : null}

                <div className="profile-info">

                    {post && <h2>{currentUser.handle}</h2>}
                    {userData?.isAdmin && <Button onClick={handelBlock}>{toggleBlock()}</Button>}
                    {userData?.handle !== currentUser?.handle && !requestFriends?.includes(userData?.handle) && !friends?.includes(userData?.handle) && <Button onClick={friendsRequest}>Add Friend</Button>}
                    {userData?.handle !== currentUser?.handle && friends.includes(userData?.handle) && <Button onClick={removeCurrentFriend}>Remove friend</Button>}
                    <p>First Name: {currentUser.firstName}</p>
                    <p>Last Name: {currentUser.lastName}</p>
                    <p>Phone Number: {currentUser.phoneNumber}</p>
                    <p>Bio: {currentUser.bio}</p>
                </div>
            </div>
            <DropdownMenu array={post} setArray={setPosts}></DropdownMenu>
            {post && post.map((post) => (
                <Post key={post.id} post={post} setPosts={setPosts}></Post>))}

        </div>

    )
}
export default Profile;