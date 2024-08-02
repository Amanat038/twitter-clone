import React from "react";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Body from "./components/body";

function App() {
   const user = useSelector((state) => state.userReducer.user);
   console.log(user);
   return (
      <>
         <Body />
      </>
   );
}

export default App;
