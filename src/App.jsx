import { Route, Routes, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import NavbarMobile from "./components/NavbarMobile"
import Home from "./pages/Home"
import Records from "./pages/Records"
import Patients from "./pages/Patients";
import Login from "./components/Login"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children,role, allowedRoles}) => {
    // const navigate = useNavigate();
    if(!role) return <Navigate to={"/login"} replace />

    if(allowedRoles.includes(role)) return children;
    
    if(role === "admin") return <Navigate to={"/"} replace />
    else if(role === "employee") return <Navigate to={"/records"} replace />
    else return <Navigate to={"/login"} replace />
}


const OpenRoute = ({children,role, allowedRoles}) => {

    if(!allowedRoles.includes(role)) return children;
    
    return <Navigate to={"/login"} replace />
}


const App = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth);
  let role = user?.user?.role;;
  // useEffect(()=>{
  //   role = user?.user?.role;
  //   console.log("USER", user);

  //   if(!user){
  //     navigate('/login');
  //   }
  //   else{
  //     if(role === "admin") navigate('/');
  //     else if(role === "employee") navigate('/records')
  //   }
  // },[])

  return (
    <div className="relative h-screen w-screen overflow-x-hidden overflow-y-auto font-mullish bg-content"> 
        
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <Header/>
        </div>
        

        <div className={`${role && "my-[75px]"}`}>
          <Routes>
            <Route path="/login" element={
              <OpenRoute role = {role} allowedRoles={["invalid"]}>
                <Login/>
              </OpenRoute>
            }/>
            <Route path="/" element={
              <ProtectedRoute role = {role} allowedRoles={["admin"]}>
                <Home/>
              </ProtectedRoute>
            }/>
            <Route path="/records" element={
              <ProtectedRoute role = {role} allowedRoles={["admin", "employee"]}>
                <Records/>
              </ProtectedRoute>
            }/>
            <Route path="/patients" element={
              <ProtectedRoute role = {role} allowedRoles={["admin"]}>
                <Patients/>
              </ProtectedRoute>
            }/>
          </Routes>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-[100]">
          <NavbarMobile role={role}/>
        </div>
    </div>
  )
}

export default App