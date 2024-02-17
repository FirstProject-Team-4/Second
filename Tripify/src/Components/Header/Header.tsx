import { NavLink } from "react-router-dom";
import './Header.css';
import Button from "../Button/Button";
import { useAppContext } from "../../Context/AppContext";
import { logoutUser } from "../../Service/auth-service";
import { useNavigate } from "react-router-dom";


export const Header = () => {
 const navigate=useNavigate();
    const { user,userData, setContext } = useAppContext();

    const logout = async() => {
        await logoutUser();
        setContext({user:null, userData:null});
        navigate('/home');

    }

   
    return (
        <header>
            <div className="header-class" >
                <NavLink to='/home' className='home'>Home</NavLink>
                {user&&userData?.isAdmin&&<NavLink to="/allUsers" className='admin'>Check Users</NavLink>}
                {!user&&<NavLink to="/register" className='register'>Register</NavLink>}
                {!user&&<NavLink to="/login" className='login'>Login</NavLink>}
                {user&&<NavLink to="/posts-create" className='create-post'>Create Post</NavLink>}
               {user&&<NavLink to={`/profile/${userData?.handle}`}>{userData?.handle}</NavLink>}
                {user&&<Button onClick={logout}>Logout</Button>}
            </div>
        
            <div className="category">
                <NavLink to="/category/hotels">Hotels</NavLink>
                <NavLink to="/category/restaurants">Restaurants</NavLink>
                <NavLink to="/category/food&drink">Food and Drink</NavLink>
                <NavLink to="/category/cruises">Cruises</NavLink>
                <NavLink to="/category/mountain">Mountain</NavLink>
                <NavLink to="/category/sea">Sea</NavLink>
                <NavLink to="/category/stories">Travel Stories</NavLink>
            </div>
        </header>);
}