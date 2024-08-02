
import React from "react"
import LeftSideBar from "../leftsideBar/leftsidebar";
import { Outlet } from "react-router-dom";

const Home = () => {


  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-md-3"><LeftSideBar /></div>
        <div className="col-md-8"> <Outlet /></div>
      </div>
    </div>
   </>
  )

  
}

export default Home ;