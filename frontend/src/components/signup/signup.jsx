import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
 import { API_BASE_URL } from "../../config";
 import Swal from 'sweetalert2'
// import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import sideimg from '../assets/Textmessage-img.png'

const SignUp = () => {
   const [name, setName] = useState("");
   const [username, setUsername] = useState("");
   const [dob, setDob] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [location, setLocation] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const navigate = useNavigate();

   const signup = (event) => {
      event.preventDefault();
      setIsLoading(true)
      const requestData = {name:name, username:username,password:password, email:email,  location:location, dob:dob}
      axios.post(`${API_BASE_URL}/signup`,requestData)
      .then((result)=> {
         // debugger;
         if(result.status === 201){
            navigate('/login')
            setIsLoading(false)
            Swal.fire({
               icon: 'success',
               title:'User successfully signed up'
            })
           
         }
      })
      .catch ((error) => {
         console.log(error);
         Swal.fire({
            icon: 'error',
            title:'Some error in signup'
         })
      })
   };

   return (
      <div className="section">
         <div className="main-section shadow-lg">
            <div className="container">
               <div className="row">
                  <div className="col-md-5 bg-primary left-box">
                     <div className="left-side">
                        <div className="">
                           <h1 className="text-white text-center">Welcome </h1>
                           <div className="img-section">
                              <img src={sideimg} alt="img"></img>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-md-7 right-box">
                     { isLoading ?  <div className="col-md-12 text-center">
                        <div class="spinner-border" role="status">
                           <span class="sr-only">Loading...</span>
                        </div>
                     </div> : ''}
                     <div className="right-side ">
                        <Form onSubmit={(e) => signup(e)}>
                           <div className="welcome-text text-center mb-4 text-primary">
                              <h1>Welcome</h1>
                           </div>

                           <Form.Group className="mb-3" controlId="formName">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                 type="text"
                                 placeholder="Enter your full name"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                              />
                           </Form.Group>

                           <Form.Group
                              className="mb-3"
                              controlId="formUsername"
                           >
                              <Form.Label>Username</Form.Label>
                              <Form.Control
                                 type="text"
                                 placeholder="Enter your username"
                                 value={username}
                                 onChange={(e) => setUsername(e.target.value)}
                              />
                           </Form.Group>

                           <Form.Group
                              className="mb-3"
                              controlId="formUsername"
                           >
                              <Form.Label>Date Of Birth</Form.Label>
                              <Form.Control
                                 type="date"
                                 placeholder="Enter your DOB"
                                 value={dob}
                                 onChange={(e) => setDob(e.target.value)}
                              />
                           </Form.Group>

                           <Form.Group className="mb-3" controlId="formEmail">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                 type="email"
                                 placeholder="Enter your email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                              />
                           </Form.Group>

                           <Form.Group
                              className="mb-3"
                              controlId="formPassword"
                           >
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                 type="password"
                                 placeholder="Enter your password"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                              />
                           </Form.Group>

                           <Form.Group
                              className="mb-3"
                              controlId="formUsername"
                           >
                              <Form.Label>Location</Form.Label>
                              <Form.Control
                                 type="text"
                                 placeholder="Location"
                                 value={location}
                                 onChange={(e) => setLocation(e.target.value)}
                              />
                           </Form.Group>

                           <Button variant="dark" type="submit">
                              SignUp
                           </Button>

                           <div className="register-text py-2">
                              <span>If you have an account?</span>
                              <span className="text-info cursor">
                                 <Link to={"/login"}>Login</Link>
                              </span>
                           </div>
                        </Form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SignUp;
