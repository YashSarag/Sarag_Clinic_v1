import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import NavbarMobile from "./components/NavbarMobile"
import Home from "./pages/Home"
import Records from "./pages/Records"
import Patients from "./pages/Patients";

const App = () => {
  return (
    <div className="relative h-screen w-screen overflow-x-hidden overflow-y-auto font-mullish bg-content"> 
        
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <Header/>
        </div>
        

        <div className="my-[75px]">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/records" element={<Records/>}/>
            <Route path="/patients" element={<Patients />}/>
          </Routes>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-[100]">
          <NavbarMobile/>
        </div>
    </div>
  )
}

export default App