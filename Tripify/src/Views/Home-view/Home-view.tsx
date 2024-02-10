import './Home-view.css';

import {  useAppContext } from '../../Context/AppContext';
export default function HomeView() {
  const {user}= useAppContext();
 console.log(user);
  return (
    <div className='home-view'>
      {user && <h1>Welcome</h1>}
      <h1>Home</h1>
    </div>
  )
}