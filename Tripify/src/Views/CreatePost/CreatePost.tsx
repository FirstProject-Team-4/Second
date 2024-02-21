import { useEffect, useState } from "react";
// import { AppContext } from "../../Context/AppContext";
import Button from "../../Components/Button/Button";
import { addPost } from "../../Service/post-service";
import { useAppContext } from "../../Context/AppContext";
import { saveImage } from "../../Service/firebase-storage";
import './CreatePost.css';




/**
 * Component for creating a post.
 *
 * @returns The CreatePost component.
 */
export default function CreatePost() {


  const { userData } = useAppContext();
  const [post, setPost] = useState({
    title: '',
    content: '',
    user: '',
    comments: '',
    image: '',
    userImage: '',
  });
  const [category, setCategory] = useState('');

  useEffect(() => {
    document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
  }, []);

  /**
   * Handles the submit event and updates the category state.
   * @param {any} event - The submit event object.
   * @returns {void}
   */
  const handleSubmit = (event: any) => {
    setCategory(event.target.value);
  };


  /**
   * Updates the post object with a new value for the specified key.
   * @param {string} value - The new value to be assigned.
   * @param {string} key - The key of the property to be updated.
   */
  const updatePost = (value: string, key: string) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  /**
   * Updates the image URL in the post object.
   * 
   * @param value - The selected image file.
   * @param key - The key of the image property in the post object.
   */
  const updateImage = (value: any, key: string) => {
    if (!value) {
      setPost({
        ...post,
        [key]: value ? value : '',
      });
      return;
    }
    if (value) {
      saveImage(value[0]).then((url) => {
        setPost({
          ...post,
          [key]: url,
        });
      });
    }
  }


  /**
   * Creates a new post.
   */
  const createPost = async () => {

    if (userData.isBlock) {
      return alert('You are blocked');
    }
    if (post.title.length < 16 || post.title.length > 64) {
      return alert('The title must be between 16 and 64 symbols.');
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert('The content must be between 32 symbols and 8192 symbols.');
    }
    let currentUserImage;
    if (userData.userImage) {
      currentUserImage = userData.userImage;
    }
    else {
      currentUserImage = userData.handle[0];
    }

    await addPost(userData.handle, post.title, post.content, post.image, currentUserImage, category); // Pass the image to the service function

    setPost({
      title: '',
      content: '',
      user: '',
      image: '',
      comments: '',
      userImage: '',

    });
    setCategory('');
  };

  return (
    userData?.isBlock ?
      <div>You are blocked</div> :

      <div className="create-view">
        <h2 id='create-h2'>Create post</h2>
        <label htmlFor="input-title" id='input-title'>Title:</label>
        <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type="text" name="input-title" id="input-title" /><br />
        <label htmlFor="input-content" id='input-content'>Content:</label><br />
        <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name="input-content" id="input-content" cols={30} rows={10}></textarea><br /><br />
        <label htmlFor="input-image" id='input-image'>Image:</label>
        <input id="input-image" type="file" accept="image/*" onChange={e => updateImage(e.target.files, 'image')} /><br />
        <form >
          <select name="category" id="category-select" onChange={handleSubmit}>
            <option value="">Select a category</option>
            <option value="hotels">Hotels</option>
            <option value="restaurants">Restaurants</option>
            <option value="food&drink">Food and Drink</option>
            <option value="cruises">Cruises</option>
            <option value="mountain">Mountain</option>
            <option value="sea">Sea</option>
            <option value="stories">Travel Stories</option>
          </select>
        </form>
        <Button id='btn-create' onClick={createPost}>Create</Button>
      </div>
  );
}