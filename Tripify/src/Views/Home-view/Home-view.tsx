import './Home-view.css';

import {  useAppContext } from '../../Context/AppContext';
import AllPosts from '../AllPosts/AllPosts';

export default function HomeView() {
  const {user}= useAppContext();
  return (
    <div className='home-view'>
      <AllPosts/>
    </div>
  )
}