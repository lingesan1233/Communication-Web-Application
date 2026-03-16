import {useState} from "react"
import API from "../services/api"

export default function UserSearch(){

const [search,setSearch] = useState("")
const [users,setUsers] = useState([])

const searchUser = async()=>{

const res = await API.get(`/users/search?search=${search}`)

setUsers(res.data)

}

return(

<div>

<input
placeholder="Search users..."
onChange={(e)=>setSearch(e.target.value)}
/>

<button onClick={searchUser}>Search</button>

{users.map(u=>(
<div key={u._id}>
{u.name}
</div>
))}

</div>

)

}