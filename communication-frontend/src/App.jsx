import {BrowserRouter,Routes,Route} from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import Profile from "./pages/Profile"
import CreateGroup from "./pages/CreateGroup"

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>
<Route path="/chat/:id" element={<Chat/>}/>

<Route path="/profile" element={<Profile/>}/>
<Route path="/create-group" element={<CreateGroup/>}/>

</Routes>

</BrowserRouter>

)

}

export default App