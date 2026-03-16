import {useState} from "react"
import {useNavigate} from "react-router-dom"
import API from "../services/api"
import "../styles/Login.css"

export default function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const login = async()=>{

try{

const res = await API.post("/auth/login",{
email,
password
})

localStorage.setItem("token",res.data.token)

navigate("/dashboard")

}
catch(err){
alert("Login failed")
}

}

return(

<div className="login">

<h2>Login</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

<p onClick={()=>navigate("/signup")}>
Create Account
</p>

</div>

)

}