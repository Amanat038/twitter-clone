import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import "./leftside.css";
import { useParams } from "react-router-dom";
import logoimg from '../assets/Textmessage-img.png'


const LeftSideBar = () => {


   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { id } = useParams();

   // Access the user state from Redux store
   const user = useSelector((state) => state.userReducer);

   const logout = () => {
      console.log("Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "LOGIN_ERROR" });
      navigate("/login", { replace: true });
      window.location.reload();
   };

   return (
      <>
         {/* <button className="menu-toggle" onClick={toggleSidebar}> */}
            {/* <FontAwesomeIcon icon={faBars} /> */}
         {/* </button> */}
         <nav className="sidebar">
            <div className="sidebar-sticky ">
               <div className="logo-img"><img src={logoimg}></img></div>
               <ul className="nav ">
                  <li className="nav-item">
                     <Link className="nav-link" to="/">
                        <FontAwesomeIcon className="sidebar-icons" icon={faHome} /> Home
                     </Link>
                  </li>
                  <li className="nav-item">
                     <Link className="nav-link" to={`/profile/${user.user._id}`}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                     </Link>
                  </li>
                  {user.user._id ? (<li className="nav-item">
                     <a className="nav-link cursor" onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                     </a>
                  </li>):""
                  }

                  {!user.user._id ? (<li className="nav-item">
                       <Link className="nav-link cursor" to={'login'}>
                          <FontAwesomeIcon icon={faSignOutAlt} /> login
                       </Link>
                    </li>):""
                    }

                  

               </ul>
               </div>
            <div className="user-box">
               {user.user._id ?
               <div className="user-info">
                  <div className="men-Avatar cursor">
                     <img
                        src={user.user.profileImg || ""}
                        alt="User Avatar"
                        className="user-avatar"
                     />
                  </div>
                  <span className="user-name">{user.user.name || "User"}</span>
               </div>
                :""}  
            </div>
           
         </nav>
      </>
   );
};

export default LeftSideBar;
