// import { navbarData } from "../data"
// import { IoHomeSharp } from "react-icons/io5";
// import { HiClipboardList } from "react-icons/hi";
// import { LuUsersRound } from "react-icons/lu";
// import { TbFileDownloadFilled } from "react-icons/tb";
// import { IoMdSettings } from "react-icons/io";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";

// const NavbarMobile = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [currentLocation, setCurrentLocation] = useState(location.pathname)

//     return (
//         <div className="flex justify-around gap-[20px] items-center bg-theme h-[65px] py-[5px]">
//             {
//                 navbarData.map((item) => (
//                     <div key={item.id} 
//                         onClick={()=>{
//                             navigate(item.link)
//                         }}
//                         className={`cursor-pointer flex flex-col items-center ${currentLocation == item.link ? "text-[#FACC15]" : "text-content"}`}>
//                         <div className="text-[28px] ">
//                             {<item.icon/>}
//                         </div>
//                         <div className="text-[12px]">{item.label}</div>
//                     </div>
//                 ))
//             }
//         </div>
//     )
// }

// export default NavbarMobile


import { navbarData } from "../data";
import { useLocation, useNavigate } from "react-router-dom";

const NavbarMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex justify-around gap-[20px] items-center bg-theme h-[65px] py-[5px]">
      {navbarData.map((item) => {
        const isActive = location.pathname === item.link;

        return (
          <div
            key={item.id}
            onClick={() => navigate(item.link)}
            className={`cursor-pointer flex flex-col items-center ${
              isActive
                ? "text-[#FACC15]"
                : "text-content"
            }`}
          >
            <div className="text-[28px]">
              <item.icon />
            </div>

            <div className="text-[12px]">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NavbarMobile;