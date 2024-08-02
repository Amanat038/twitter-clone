import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./profile/profile";
import Login from "./login/login";
import Home from "./home/home";
import Feed from "./Feed/feed";
import Register from "./signup/signup";
import Post from "./post/post";
import Following from "./profile/following";
import Followers from "./profile/followers";

const Body = () => {
   const appRouter = createBrowserRouter([
      {
         path: "/",
         element: <Home />,
         children: [
            {
               index: true,
               element: <Feed />,
            },
            {
               path: "profile/:id",
               element: <Profile />,
            },
            {
               path: "post/:postId",
               element: <Post/>,
            },
            {
               path: "following/:id",
               element: <Following/>,
            },
            {
               path: "followers/:id",
               element: <Followers/>,
            }

         ],
      },
      {
         path: "login",
         element: <Login />,
      },
      {
         path: "signup",
         element: <Register />,
      }
   ]);
   return (
      <div>
         <RouterProvider router={appRouter} />
      </div>
   );
};

export default Body;
