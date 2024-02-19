import { useEffect, useState } from "react"
import { getAllUsers } from "../../Service/user-service";
import { NavLink } from "react-router-dom";
import Button from "../../Components/Button/Button";
import './AllUsers.css'

export default function AllUsers() {
    const [users, setUsers] = useState([] as any);
    const [search, setSearch] = useState('');

    useEffect(() => {
        searchUser();
    }, [search])

    const handleSearch = (value: string) => {
        setSearch(value);
        searchUser();

    }
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
            {/* <label className="label-search">Search by Username</label><br></br> */}
            <input type="text" value={search} className="search" placeholder="Search by Username..." onChange={e => handleSearch(e.target.value)} />
            <Button onClick={searchUser} id='btn-search'>Search</Button>
            <div className="inf">
                {users.map((user: any) => {
                    return <div className="border-users" key={user.id}>
                          <div className="header">
                          {user?.userImage?.length > 1 && <img src={user.userImage} className='img' alt="profile" />}
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

