import { NavLink } from "react-router-dom";
import './Header.css';
import Button from "../Button/Button";
import { useAppContext } from "../../Context/AppContext";
import { logoutUser } from "../../Service/auth-service";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FriendsView from "../../Views/Friends-view/Friends-view";
import logo from '/img/Tripify-forum.png';

/**
 * Renders the header component.
 * 
 * @returns The header component.
 */
export const Header = () => {
    const navigate = useNavigate();
    const { user, userData, setContext } = useAppContext();
    const location = useLocation();

    /**
     * Logs out the user, clears the user context, and navigates to the home page.
     */
    const logout = async () => {
        await logoutUser();
        setContext({ user: null, userData: null });
        navigate('/home');
    }


    return (
        <header>
            <div className="header-class" >
                <NavLink to='/home' className='logo'>
                    <img src={logo} alt="Logo" />
                </NavLink>
                {user && userData?.isAdmin && <NavLink to="/allUsers" className='admin' >Check Users</NavLink>}
                {!user && <NavLink to="/register" className='register'>Register</NavLink>}
                {!user && <NavLink to="/login" className='login'>Login</NavLink>}
                {user && <NavLink to="/posts-create" className='create-post'>Create Post</NavLink>}
                {user && <NavLink to={`/profile/${userData?.handle}`} className='user'>{userData?.handle}</NavLink>}
                {user && <Button id="logout-button" onClick={logout} >Logout</Button>}

            </div>
            {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/allUsers' && (
                <div className="category">
                    <h2 id="categories-h2" >Categories</h2>
                    <NavLink to="/category/hotels" className="nav-link">Hotels</NavLink>
                    <NavLink to="/category/restaurants" className="nav-link">Restaurants</NavLink>
                    <NavLink to="/category/food&drink" className="nav-link">Food and Drink</NavLink>
                    <NavLink to="/category/cruises" className="nav-link">Cruises</NavLink>
                    <NavLink to="/category/mountain" className="nav-link">Mountain</NavLink>
                    <NavLink to="/category/sea" className="nav-link">Sea</NavLink>
                    <NavLink to="/category/stories" className="nav-link">Travel Stories</NavLink>
                </div>
            )}
            {location.pathname !== `/login` && location.pathname !== '/register' && location.pathname !== '/allUsers' && <div id="friend-view" >
                <FriendsView />
            </div>}
        </header>);
}