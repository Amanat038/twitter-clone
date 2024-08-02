import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart,
   faComment,
   faRetweet,
   faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Modal, Button, Form } from "react-bootstrap";
import "./Alltweets.css"; 

const Alltweets = (props) => {
   const user = useSelector((state) => state.userReducer.user);
   const [showCommentModal, setShowCommentModal] = useState(false);
   const [comment, setComment] = useState("");
   const [selectedPostId, setSelectedPostId] = useState(null);
   const [comments, setComments] = useState([]);

   const handleLike = async (postId) => {
      try {
         const response = await axios.post(
            `${API_BASE_URL}/like`,
            { postId },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            }
         );
         if (response.status === 200) {
            props.updateTweet(response.data.post);
         } else {
            console.log("Error liking/unliking post");
         }
      } catch (error) {
         console.error("Error liking/unliking post:", error);
      }
   };

   const handleCommentClick = async (postId) => {
      setSelectedPostId(postId);
      setShowCommentModal(true);
      try {
         const response = await axios.get(
            `${API_BASE_URL}/comments/${postId}`,
            {
               headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            }
         );
         if (response.status === 200) {
            setComments(response.data.comments);
         } else {
            console.log("Error fetching comments");
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
      }
   };

   const handleCloseCommentModal = () => {
      setShowCommentModal(false);
      setSelectedPostId(null);
      setComment("");
   };

   const handleCommentSubmit = async () => {
      if (!comment.trim()) {
         console.error("Comment cannot be empty");
         return;
      }

      try {
         const response = await axios.post(
            `${API_BASE_URL}/comment`,
            { postId: selectedPostId, commentText: comment },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            }
         );
         if (response.status === 200) {
            props.updateTweet(response.data.post);
            handleCloseCommentModal();
         } else {
            console.log("Error adding comment");
         }
      } catch (error) {
         console.error("Error adding comment:", error);
      }
   };

   const handleRetweet = async (postId) => {
      try {
         const response = await axios.post(
            `${API_BASE_URL}/retweet`,
            { postId },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            }
         );
         if (response.status === 200) {
            props.updateTweet(response.data.post);
         } else {
            console.log("Error retweeting post");
         }
      } catch (error) {
         console.error("Error retweeting post:", error);
      }
   };

   return (
      <div className="tweet-box border p-3 mt-3">
         <div className="d-flex">
            <div className=" cursor" style={{width:"70px", height:"70px"}}>
               <Link to={`/profile/${props.postData.author._id}`}>
                  <img
                     src={props.postData.author.profileImg}
                     alt="Profile"
                     className=" profile-img"
                  />
               </Link>
            </div>
            <div className="tweet-content ms-3">
               <div className="d-flex justify-content-between cursor">
                  <Link
                     to={`/profile/${props.postData.author._id}`}
                     className="text-decoration-none text-dark text-capitalize"
                  >
                     <h4>{props.postData.author.name}</h4>
                     <span>
                        <p style={{ fontSize: "13px" }}>
                           {new Date(props.postData.createdAt).toLocaleTimeString()}
                        </p>
                     </span>
                  </Link>
                  {user && user._id === props.postData.author._id && (
                     <small
                        onClick={() => props.deletePost(props.postData._id)}
                        className="text-muted"
                        style={{ cursor: "pointer" }}
                     >
                        <FontAwesomeIcon icon={faTrashAlt} />
                     </small>
                  )}
               </div>

               {props.postData.originalAuthor && (
                  <div>
                     <p>Original Post User</p>
                     <div className="original-author d-flex align-items-center">
                        <div className="profile-img-container cursor">
                           <Link to={`/profile/${props.postData.originalAuthor._id}`}>
                              <img
                                 src={props.postData.originalAuthor.profileImg}
                                 alt="Profile"
                                 className="rounded-circle profile-img"
                              />
                           </Link>
                        </div>
                        <div>
                           <h5 className="text-dark text-capitalize">
                              {props.postData.originalAuthor.name}
                           </h5>
                        </div>
                     </div>
                  </div>
               )}

               <Link
                  to={`/post/${props.postData._id}`}
                  className="text-decoration-none text-dark text-capitalize"
               >
                  <p className="tweet-text">{props.postData.description}</p>
                  <div className="tweet-img-box">
                     {props.postData.image && (
                        <div className="tweet-image-container">
                           <img
                              src={props.postData.image}
                              alt="Post content"
                              className="img-fluid tweet-image"
                           />
                        </div>
                     )}
                  </div>
               </Link>
               <div className="tweet-actions d-flex justify-content-between mt-3">
                  <div className="d-flex tweet-action">
                     <FontAwesomeIcon
                        icon={faRetweet}
                        style={{
                           cursor: "pointer",
                           color: props.postData.retweets > 0 ? "blue" : "initial",
                        }}
                        className={`me-2 ${props.postData.retweets > 0 ? "text-blue" : ""}`}
                        onClick={() => handleRetweet(props.postData._id)}
                     />
                     <span>{props.postData.retweets}</span>
                  </div>
                  <div className="d-flex tweet-action">
                     <FontAwesomeIcon
                        icon={faHeart}
                        style={{ cursor: "pointer" }}
                        className={`me-2 ${
                           props.postData.likes.includes(user._id) ? "text-danger" : ""
                        }`}
                        onClick={() => handleLike(props.postData._id)}
                     />
                     <span>{props.postData.likes.length}</span>
                  </div>
                  <div className="d-flex tweet-action">
                     <FontAwesomeIcon
                        icon={faComment}
                        className="me-2"
                        style={{
                           cursor: "pointer",
                           color: props.postData.comments.length > 0 ? "blue" : "initial",
                        }}
                        onClick={() => handleCommentClick(props.postData._id)}
                     />
                     <span>{props.postData.comments.length}</span>
                  </div>
               </div>

               {comments.length > 0 && (
                  <div className="comments-section mt-3">
                     {comments.map((comment, index) => (
                        <div key={index} className="comment mb-2">
                           <strong>{comment.author.name}:</strong> {comment.commentText}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <Modal show={showCommentModal} onHide={handleCloseCommentModal}>
            <Modal.Header closeButton>
               <Modal.Title>Write a Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form>
                  <Form.Group controlId="comment">
                     <Form.Label>Comment</Form.Label>
                     <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                     />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseCommentModal}>
                  Close
               </Button>
               <Button variant="primary" onClick={handleCommentSubmit}>
                  Submit Comment
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default Alltweets;
