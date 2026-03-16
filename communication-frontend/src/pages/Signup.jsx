import {useState} from "react"
import {useNavigate} from "react-router-dom"
import API from "../services/api"
import "../styles/Signup.css"

export default function Signup(){

const navigate = useNavigate()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const signup = async()=>{

try{

await API.post("/auth/signup",{
name,
email,
password
})

navigate("/")

}
catch(err){
alert("Signup failed")
}

}

return(

<div className="signup">

<h2>Signup</h2>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
<input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={signup}>Signup</button>

</div>

)

}