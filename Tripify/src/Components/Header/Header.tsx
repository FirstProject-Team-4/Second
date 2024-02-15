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
                {!user&&<NavLink to="/register" className='register'>Register</NavLink>}
                {!user&&<NavLink to="/login" className='login'>Login</NavLink>}
                {user&&<NavLink to="/posts-create" className='create-post'>Create Post</NavLink>}
               {user&&<NavLink to={`/profile/${userData?.handle}`}>{userData?.handle}</NavLink>}
                {user&&<Button onClick={logout}>Logout</Button>}
            </div>
        
            {/* <div className="category">
                <NavLink to="/category/1">1</NavLink>
                <NavLink to="/category/2">2</NavLink>
                <NavLink to="/category/3">3</NavLink>
            </div> */}
        </header>);
}