import AllPosts from '../AllPosts/AllPosts-view/AllPosts';
import { useEffect } from 'react';

/**
 * Renders the HomeView component.
 * Sets the background image of the body and cleans up the background image on unmount.
 * @returns The rendered HomeView component.
 */
export default function HomeView() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    return () => {
      document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
    }
  }, []);

  return (
    <div className='home-view'>
      <AllPosts />
    </div>
  )
}