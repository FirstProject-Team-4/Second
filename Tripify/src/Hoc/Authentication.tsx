
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Authentication(prop:any) {
    const navigate = useNavigate();
    const { userData } = useAppContext();


    useEffect(() => {
      
    }, [userData]);
console.log(userData)
    return (
    <>
    {userData?.isAdmin && prop.children }
    </>);
}
