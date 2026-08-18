import Logo from "../assets/logo-2.png";
import Profile from "../assets/profile-test.png";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useLocation } from "react-router-dom";

const Header = () => {
    const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout request failed:", response.status);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Clear Redux + localStorage
      dispatch(logout());

      // Go to login
      window.location.replace("/login");
    }
  };

  const location = useLocation();

  return (
    <div className="flex items-center justify-between p-[5px] bg-theme text-white">
      <div className="flex items-center">
        <img src={Logo} className="w-[50px]" />
        <div className="text-2xl opacity-100 font-bold  mb-[-10px] ml-[-3px]">
          arag Clinic
        </div>
      </div>

      <div className="flex items-center gap-[15px]">
        {location.pathname !== '/login' && <div
          className="px-[18px] py-[8px] text-sm bg-button rounded-md cursor-pointer 
                hover:scale-[0.95] transition-all duration-200"
          onClick={handleLogout}
        >
          Logout
        </div>}
        <div>
          <img
            src={Profile}
            className="w-[45px] aspect-square object-cover rounded-full border-[2px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
