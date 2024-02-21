import { useEffect, useState } from "react"
import { getAllUsers } from "../../Service/user-service";
import { NavLink } from "react-router-dom";
import Button from "../../Components/Button/Button";
import './AllUsers.css'

/**
 * Renders a component that displays a list of users and allows searching by username.
 * 
 * @returns The rendered component.
 */
export default function AllUsers() {
    const [users, setUsers] = useState([] as any);
    const [search, setSearch] = useState('');

    useEffect(() => {
        document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
        document.body.style.backgroundSize = 'contain';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        searchUser();
    }, [search])



    /**
     * Handles the search functionality.
     * 
     * @param value - The search value entered by the user.
     */
    const handleSearch = (value: string) => {
        setSearch(value);
        searchUser();
    }

    /**
     * Searches for users based on the provided search term.
     */
    const searchUser = async () => {
        const snapshot = await getAllUsers();
        const filtered = snapshot.filter((user: any) => {
            return (user.id.includes(search))
        })
        setUsers(filtered);
    }

    return (
        <div>
            <h1>Users</h1>
            <input type="text" value={search} className="search" placeholder="Search by Username..." onChange={e => handleSearch(e.target.value)} />
            <Button onClick={searchUser} id='btn-search'>Search</Button>
            <div className="inf">
                {users.map((user: any) => {
                    return <div className="border-users" key={user.id}>
                        <div className="header">
                            {user?.userImage?.length > 1 && <img src={user.userImage} className='img' alt="profile" />}
                            {!user.userImage && <span className="letter">{user.handle[0]}</span>}
                            <div className="information">
                                <NavLink to={`/profile/${user.handle}`}>{user.handle}</NavLink>
                            </div>
                        </div>

                        <p>✉ Email: {user.email}</p>
                        <p>Created Date: {user.createdOn}</p>
                        <p>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
                        <p style={{ color: `${user.isBlock ? 'red' : 'purple'}` }}>Status: {user.isBlock ? 'Blocked' : 'Not Blocked'}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

