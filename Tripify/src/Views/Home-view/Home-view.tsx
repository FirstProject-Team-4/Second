import { useAppContext } from '../../Context/AppContext';
import AllPosts from '../AllPosts/AllPosts-view/AllPosts';
import { useEffect } from 'react';

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

  const { user } = useAppContext();
  return (
    <div className='home-view'>
      <AllPosts />
    </div>
  )
}