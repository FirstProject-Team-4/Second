import { useEffect, useState } from "react"
import { getUserByHandle } from "../../../Service/user-service"
import './userImage.css'
import { useAppContext } from "../../../Context/AppContext";

 export   default function Image({author}:string|any) {
    const [user, setUser] = useState<any>(null)
    const {userData} = useAppContext();

useEffect(() => {
    (async()=>{
    const result= await getUserByHandle(author);
    setUser(result.val());
})()
}, [userData])

    return (
        <>
          {user?.userImage?  <img className="img" src={user?.userImage} alt="user" />:<span className="letter">{user?.handle[0]}</span>}
        </>
    )
}