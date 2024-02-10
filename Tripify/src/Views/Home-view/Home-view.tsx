import './Home-view.css';

import {  useAppContext } from '../../Context/AppContext';
export default function HomeView() {
  const {user}= useAppContext();
 
  return (
    <div className='home-view'>
      {user && <h1>Welcome {user}</h1>}
      <h1>Home</h1>
    </div>
  )
}