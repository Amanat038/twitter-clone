import React, { useEffect, useState } from "react";
import {
   Container,
   Row,
   Col,
   Image,
   Button,
   Modal,
   Form,
} from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import "./profile.css";

const Profile = () => {
   const dispatch = useDispatch();
   const users = useSelector((state) => state.userReducer);
   const { id } = useParams();
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [myAllPosts, setMyAllPosts] = useState([]);
   const [showModal, setShowModal] = useState(false);

   const [profileData, setProfileData] = useState({
      name: "",
      username: "",
      profileImg: "",
   });

   const formatDate = (dateString) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   const CONFIG_OBJ = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer " + localStorage.getItem("token"),
      },
   };

   const handleShow = () => setShowModal(true);
   const handleClose = () => setShowModal(false);

   const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files) {
         const reader = new FileReader();
         reader.onload = () => {
            setProfileData({ ...profileData, [name]: reader.result });
         };
         reader.readAsDataURL(files[0]);
      } else {
         setProfileData({ ...profileData, [name]: value });
      }
   };

   const handleSave = async () => {
      try {
         const response = await axios.put(
            `${API_BASE_URL}/user/${id}`,
            profileData,
            CONFIG_OBJ
         );
         if (response.status === 200) {
            setUser(response.data);
            dispatch({ type: "UPDATE_PROFILE", payload: response.data.user });
            handleClose();
         } else {
            console.error("Unexpected response status:", response.status);
         }
      } catch (error) {
         console.error("Error updating profile:", error);
      }
   };

   const getMyPosts = async () => {
      try {
         const response = await axios.get(
            `${API_BASE_URL}/myallposts/${id}`,
            CONFIG_OBJ
         );
         if (response.status === 200) {
            setMyAllPosts(response.data.posts);
         } else {
            console.error("Error fetching posts:", response.status);
         }
      } catch (error) {
         console.error("Error fetching posts:", error);
      }
   };

   const following = async (userIdToFollow) => {
      try {
         const response = await axios.post(
            `${API_BASE_URL}/follow`,
            { userIdToFollow },
            CONFIG_OBJ
         );
         if (response.status === 200) {
            Swal.fire({
               icon: "success",
               title: "You follow this user successfully",
            });
         }
      } catch (error) {
         Swal.fire({
            icon: "error",
            title: "Error in following this user",
         });
      }
   };

   const unfollow = async (userIdToUnfollow) => {
      try {
         const response = await axios.post(
            `${API_BASE_URL}/unfollow`,
            { userIdToUnfollow },
            CONFIG_OBJ
         );
         if (response.status === 200) {
            Swal.fire({
               icon: "success",
               title: "You unfollowed this user successfully",
            });
            setUser((prevUser) => ({
               ...prevUser,
               user: {
                  ...prevUser.user,
                  following: prevUser.user.following.filter(
                     (id) => id !== userIdToUnfollow
                  ),
               },
            }));
         }
      } catch (error) {
         Swal.fire({
            icon: "error",
            title: "Error in unfollowing this user",
         });
      }
   };

   const getUser = async () => {
      try {
         const response = await axios.get(`${API_BASE_URL}/getme/${id}`);
         setUser(response.data);
         setProfileData({
            name: response.data.user.name,
            username: response.data.user.username,
            // profileImg: response.data.user.profileImg || "",
            location: response.data.user.location || "",
            // dob: response.data.user.dob || "",
         });
         setLoading(false);
      } catch (error) {
         console.error("Error fetching user:", error);
         setError(
            error.response ? error.response.data : { error: "Network error" }
         );
         setLoading(false);
      }
      getMyPosts();
   };

   useEffect(() => {
      getUser();
   }, [id]);

   return (
      <div>
         {user && (
            <>
               <Container className="profile-container">
                  <div className="cover-photo">
                     <Image src={user.user.coverImg || ""} fluid />
                  </div>
                  <div className="profile-details">
                     <Row className="align-items-center">
                        <div className="user-details">
                           <div>
                              <Col xs={4} md={3} className="text-center">
                                 <div className="profile-picture">
                                    {user.user.profileImg && (
                                       <Image
                                          src={user.user.profileImg}
                                          roundedCircle
                                          className="profile-image"
                                       />
                                    )}
                                 </div>
                              </Col>
                           </div>
                           <div className="mx-5">
                              <Col xs={8} md={6}>
                                 {user.user.name && (
                                    <h2 style={{ textTransform: "capitalize" }}>
                                       {user.user.name}
                                    </h2>
                                 )}
                                 <h6
                                    style={{ color: "black", display: "flex" }}
                                 >
                                    <span>@</span>
                                    {user.user.username && (
                                       <p>{user.user.username}</p>
                                    )}
                                 </h6>
                                 <p>
                                    {user.user.dob ? (
                                       <h6>{formatDate(user.user.dob)}</h6>
                                    ) : (
                                       "dob: ?"
                                    )}
                                 </p>
                                 <p>
                                    {user.user.location ? (
                                       <p
                                          style={{
                                             textTransform: "capitalize",
                                          }}
                                       >
                                          Live In: {user.user.location}
                                       </p>
                                    ) : (
                                       "location: ?"
                                    )}
                                 </p>
                              </Col>
                           </div>
                        </div>
                        <Col xs={12} md={3} className="text-end">
                           {user.user._id === users.user._id && (
                              <Button
                                 variant="primary"
                                 className="edit-profile-button"
                                 onClick={handleShow}
                              >
                                 Edit Profile
                              </Button>
                           )}
                        </Col>
                     </Row>
                     <div
                        className="d-flex follow-section p-3 align-items-center"
                        style={{
                           cursor: "pointer",
                           justifyContent: "space-between",
                           backgroundColor: "#f8f9fa",
                           borderRadius: "8px",
                           width: "auto",
                        }}
                     >
                        <div className="follow-con">
                           <div className="d-flex">
                              <Link
                                 to={`/following/${user.user._id}`}
                                 className="text-decoration-none btn bg-info mx-2"
                              >
                                 <div className="mx-3 text-dark">
                                    <span className="font-weight-bold">
                                       Following
                                    </span>
                                    <span className="badge badge-primary mx-2">
                                       {user.user.following.length}
                                    </span>
                                 </div>
                              </Link>
                              <Link
                                 to={`/followers/${user.user._id}`}
                                 className="text-decoration-none btn bg-info mx-2"
                              >
                                 <div className="mx-3 text-dark">
                                    <span className="font-weight-bold">
                                       Followers
                                    </span>
                                    <span className="badge badge-primary mx-2">
                                       {user.user.followers.length}
                                    </span>
                                 </div>
                              </Link>
                           </div>
                           <div>
                              {user.user._id !== users.user._id && (
                                 <div className="d-flex">
                                    <div
                                       className="mx-3"
                                       onClick={() => following(user.user._id)}
                                    >
                                       {users.user._id && (
                                          <button className="btn btn-outline-primary">
                                             Follow
                                          </button>
                                       )}
                                    </div>

                                    <div
                                       className="mx-3"
                                       onClick={() => unfollow(user.user._id)}
                                    >
                                       {users.user._id && (
                                          <button className="btn btn-outline-primary">
                                             Unfollow
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="tweets-section">
                     <h3>Tweets</h3>
                     {myAllPosts.length > 0 ? (
                        myAllPosts.map((tweet) => (
                           <div key={tweet._id} className="tweet">
                              <div className="tweet-header">
                                 {tweet.author.profileImg && (
                                    <Image
                                       src={tweet.author.profileImg}
                                       roundedCircle
                                       className="tweet-profile-image"
                                    />
                                 )}
                                 <div className="tweet-author">
                                    <h5>{tweet.author.name}</h5>
                                    <p>@{tweet.author.username}</p>
                                 </div>
                              </div>
                              <div className="tweet-body">
                                 <p>{tweet.description}</p>
                                 {tweet.image && (
                                    <Image
                                       src={tweet.image}
                                       className="tweet-image"
                                       fluid
                                    />
                                 )}
                              </div>
                           </div>
                        ))
                     ) : (
                        <p>No tweets to show</p>
                     )}
                  </div>
               </Container>
               <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Edit Profile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group controlId="formProfileImg">
                           <Form.Label>Profile Image</Form.Label>
                           <Form.Control
                              type="file"
                              name="profileImg"
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group controlId="formName">
                           <Form.Label>Name</Form.Label>
                           <Form.Control
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                           <Form.Label>Username</Form.Label>
                           <Form.Control
                              type="text"
                              name="username"
                              value={profileData.username}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        {/* Add other fields as needed */}
                     </Form>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={handleClose}>
                        Close
                     </Button>
                     <Button variant="primary" onClick={handleSave}>
                        Save Changes
                     </Button>
                  </Modal.Footer>
               </Modal>
            </>
         )}
      </div>
   );
};

export default Profile;
