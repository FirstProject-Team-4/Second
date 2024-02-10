import { NavLink } from "react-router-dom";
import './Header.css';
import Button from "../Button";
import { useAppContext } from "../../Context/AppContext";
import { logoutUser } from "../../Service/auth-service";


export const Header = () => {

    const { user,userData, setContext } = useAppContext();
    const logout = async() => {
        await logoutUser();
        setContext({user:null, userData:null});
    }
    return (
        <header>
            <div className="header-class" >
                <NavLink to='/home' className='home'>Home</NavLink>
                {!user&&<NavLink to="/register" className='register'>Register</NavLink>}
                {!user&&<NavLink to="/login" className='login'>Login</NavLink>}
                {user&&<span>{userData.handle} </span>}
                {user&&<Button onClick={logout}>Logout</Button>}
            </div>
            <input type="text" placeholder="Search..." className="search"/>
            {/* <div className="category">
                <NavLink to="/category/1">1</NavLink>
                <NavLink to="/category/2">2</NavLink>
                <NavLink to="/category/3">3</NavLink>
            </div> */}
        </header>);
}