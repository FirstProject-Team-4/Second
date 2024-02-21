import { useEffect, useState } from "react"
import { addFriend, rejectFriend } from "../../Service/friends-service"
import { useAppContext } from "../../Context/AppContext"

/**
 * Renders a component that displays friend requests and allows the user to accept or reject them.
 * 
 * @param friendsRequest - The object containing friend requests.
 * @returns The rendered component.
 */
export default function friendsRequest({ friendsRequest }: any) {

    const [request, setRequest] = useState([] as any)
    const { userData, setContext } = useAppContext()
    useEffect(() => {
        /**
         * Transforms the friendsRequest object into an array of friend requests.
         * 
         * @param friendsRequest - The object containing friend requests.
         * @returns An array of friend requests with additional properties.
         */
        const currentRequests = Object.keys(friendsRequest).map((key: any) => {
            return {
                id: key,
                handle: key,
                ...friendsRequest[key]
            }
        })
        setRequest(currentRequests)
    }, [friendsRequest])

    /**
     * Accepts a friend request.
     * 
     * @param singlyRequest - The friend request to accept.
     */
    const acceptRequest = (singlyRequest: { handle: string, uid: string, id: string }) => {
        addFriend({ handle: userData.handle, uid: userData.uid }, singlyRequest)
        setRequest(request.filter((request: any) => request.id !== singlyRequest.id))
        setContext({ ...userData, friends: { ...userData.friends, [singlyRequest.uid]: { singlyRequest } } })
    }
    /**
     * Rejects a friend request.
     * 
     * @param singlyRequest - The friend request to reject.
     */
    const rejectRequest = (singlyRequest: { handle: string, uid: string, id: string }) => {
        rejectFriend({ handle: userData.handle, uid: userData.uid }, singlyRequest)
        setRequest(request.filter((request: any) => request.id !== singlyRequest.id))
        setContext({ ...userData, friendsRequest: { ...userData.friendsRequest, [singlyRequest.uid]: null } })
    }


    return (
        request && <>
            <h4 id='title-request'>Friend Requests</h4>
            {request.map((request: any, index: number) => {
                return (

                    <div key={index} id="fr-id">
                        <p>{request.handle}</p>
                        <button className="btn" onClick={() => acceptRequest(request)}>Accept</button>
                        <button className='btn' onClick={() => rejectRequest(request)}>Reject</button>
                    </div>
                )
            })}
        </>

    )

}