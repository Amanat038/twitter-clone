import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link , useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { API_BASE_URL } from "../../config";
import Swal from "sweetalert2";
import "./style.css";
import sideimg from '../assets/Textmessage-img.png'

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const user = useSelector(state=> state.userReducer.user)
   console.log(user)
   console.log("data",user)
   console.log("data name",user.name)

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const login = (event) => {
      // debugger
      event.preventDefault();
      setIsLoading(true);
      const requestData = { email, password };

      // console.log("Sending login request with data:", requestData);

      axios
         .post(`${API_BASE_URL}/login`, requestData)
         .then((result) => {
            debugger
            // console.log("Response from server:", result);
            if (result.status === 200) {
               setIsLoading(false);
                  localStorage.setItem("token", result.data.result.token);
                  localStorage.setItem('user',JSON.stringify(result.data.result.user))
                  dispatch({type:'LOGIN_SUCCESS',payload:result.data.result.user});
               
                  navigate('/')
               Swal.fire({
                  icon: "success",
                  title: "User successfully login",
               });
            }
         })
         .catch((error) => {
            console.log("Error during login:", error);
            setIsLoading(false);
            Swal.fire({
               icon: "error",
               title: error.response.data.error,
            });
         });
   };

   return (
      <>
         <div className="section">
            <div className="main-section shadow-lg">
               <div className="container">
                  <div className="row">
                     <div className="col-md-5 bg-primary left-box">
                        <div className="left-side">
                           <div className="">
                              <h1 className="text-white text-center">
                                 Welcome{" "}
                              </h1>
                              <div className="img-section">
                              <img src={sideimg} alt="img"></img>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="col-md-7 right-box">
                        {isLoading ? (
                           <div className="col-md-12 text-center">
                              <div className="spinner-border" role="status">
                                 <span className="sr-only">Loading...</span>
                              </div>
                           </div>
                        ) : (
                           ""
                        )}
                        <div className="right-side ">
                           <Form onSubmit={login}>
                              <div className="welcome-text text-center mb-4 text-primary">
                                 <h1>Welcome Back</h1>
                              </div>
                              <Form.Group
                                 className="mb-3"
                                 controlId="exampleForm.ControlInput1"
                              >
                                 <Form.Label>Email address</Form.Label>
                                 <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                 />
                              </Form.Group>
                              <Form.Label htmlFor="inputPassword5">
                                 Password
                              </Form.Label>
                              <Form.Control
                                 type="password"
                                 id="inputPassword5"
                                 aria-describedby="passwordHelpBlock"
                                 name="password"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                              />
                              <br />
                              <Button variant="dark" type="submit">
                                 Login
                              </Button>
                              <div className="register-text py-2">
                                 <span className="">
                                    If you don't have a account ?{" "}
                                 </span>
                                 <span className="text-info cursor">
                                    <Link to={"/signup"}>Sign Up</Link>
                                 </span>
                              </div>
                           </Form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Login;
