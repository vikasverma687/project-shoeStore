import { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbarcss.css"
import Authfetch from "../Pages/Authfetch";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../Pages/AdminPanel";
import Login from "../Pages/Login";
import WishList from "../Pages/WishList";

function Navbar() {

  const role = localStorage.getItem("role")
  const navigate = useNavigate();

  const handleLogout = async () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("page");
    navigate("/Login");
  }



  const handleAdminPanel = async () => {

    const response = await Authfetch("http://localhost:8081/api/admin/adminpanel")

    const data = await response.json();
    console.log(data.message)

    if (response.ok) {
      navigate("/AdminPanel");

    } else {
      alert(data.message);
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">ShoeStore.Com</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/cart">Cart</a></li>
          
          <li><a href="/WishList">WishList</a></li>
          <li><a href="/YourOrders"> Your orders</a></li>
          
          <li><a href="/Aboutus"> About-us</a></li>
          {role === "ADMIN" && <li><a href="#" onClick={handleAdminPanel}> AdminPanel </a></li>
          }

          {role ?
            <li><a href="#" onClick={handleLogout}>LogOut</a></li> : <li><Link to={"/Login"}> Login</Link></li>
          }
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;