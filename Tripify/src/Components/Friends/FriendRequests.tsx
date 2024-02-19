import { useEffect, useState } from "react"
import { addFriend } from "../../Service/friends-service"
import { useAppContext } from "../../Context/AppContext"
import Button from "../Button/Button"

export default function friendsRequest({friendsRequest}:any){

    const[request,setRequest]=useState([] as any)
    const{userData}=useAppContext()
    useEffect(()=>{
        const currentRequests = Object.keys(friendsRequest).map((key:any) => {
            return {
                id: key,
                handle: key,
                ...friendsRequest[key]
            }
        })
        console.log(currentRequests)
        setRequest(currentRequests)
    },[])
    const acceptRequest= (singlyRequest:{handle:string,uid:string,id:string})=>{
     addFriend({handle:userData.handle,uid:userData.uid},singlyRequest)
    }
    const rejectRequest=()=>{
        //reject request
    }
        
    
    return (
        request && <div>
            <h1>Friend Requests</h1>
            {request.map((request:any, index:number) => {
                return (
                    <div key={index}>
                        <p>{request.handle}</p>
                        <button onClick={()=>acceptRequest(request)}>Accept</button>
                        <button onClick={() => rejectRequest}>Reject</button>
                    </div>
                )
            })}
            </div>
        
    )

}