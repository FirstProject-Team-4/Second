import { useEffect, useState } from "react"
import { getAllUsers } from "../../Service/user-service";
import { NavLink } from "react-router-dom";
import Button from "../../Components/Button/Button";


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
            <label>Search by Username</label><br></br>
            <input type="text" value={search} onChange={e => handleSearch(e.target.value)} />
            <Button onClick={searchUser}>Search</Button>
            <div>
                {users.map((user: any) => {
                    return <div style={{ border: '1px solid blue' }} key={user.id}>
                        <NavLink to={`/profile/${user.handle}`}>{user.handle}</NavLink>
                        <p>Email: {user.email}</p>
                        <p>Created Date: {user.createdOn}</p>
                        <p>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
                        <p style={{ color: `${user.isBlock ? 'red' : 'black'}` }}>Status: {user.isBlock ? 'Blocked' : 'Not Blocked'}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

