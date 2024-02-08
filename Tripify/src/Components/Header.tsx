import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <header>
            <div >
            <NavLink to='/home'>Home</NavLink> 
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
            </div>
            <input type="text" placeholder="Search..."/>
            <div>
                <NavLink id={'1'} to="/category/1">1</NavLink>
                <NavLink to="/category/2">2</NavLink>
                <NavLink to="/category/3">3</NavLink>
            </div>
        </header>);
}