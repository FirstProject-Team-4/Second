import { NavLink } from "react-router-dom";
import './Header.css';
export const Header = () => {
    return (
        <header>
            <div className="header-class" >
                <NavLink to='/home' className='home'>Home</NavLink>
                <NavLink to="/register" className='register'>Register</NavLink>
                <NavLink to="/login" className='login'>Login</NavLink>
            </div>
            <input type="text" placeholder="Search..." className="search"/>
            <div className="category">
                <NavLink to="/category/1">1</NavLink>
                <NavLink to="/category/2">2</NavLink>
                <NavLink to="/category/3">3</NavLink>
            </div>
        </header>);
}