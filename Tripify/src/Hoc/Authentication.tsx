
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Authentication(prop:any) {
    const navigate = useNavigate();
    const { userData } = useAppContext();

console.log(userData);
    useEffect(() => {
      
    }, [userData]);

    return (
    <>
    {userData?.isAdmin ? prop.children : <h1>404 Page not found</h1>}
    </>);
}
