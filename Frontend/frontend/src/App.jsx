import  Login  from "./Pages/Login"
import Main from "./Pages/Main";
import Register from "./Pages/Register"
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      
        <Routes>
          <Route path = "/" element={<Register/>}></Route>
          <Route path = "/login" element = {<Login/>}/>
          <Route path="/main" element={<Main/>}/>
        </Routes>
    
      
    </>
  )
}

export default App
