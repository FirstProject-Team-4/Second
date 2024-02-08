import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <header>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/home'>Home</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
        </header>);
}