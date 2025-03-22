import React, { useEffect, useState } from "react";
import { Button, Modal, Form,Spinner } from "react-bootstrap";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import './feed.css';
import { API_BASE_URL } from "../../config";
import Alltweets from "../alltweets/alltweets";

const Feed = () => {
  const user = useSelector(state => state.userReducer.user);

  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [allposts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(false); 


  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setImage({ preview: '', data: '' });
    setDescription("");
    setLocation("");
  };

  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0]
    };
    setImage(img);
  };

  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append('file', image.data);

    try {
      const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData);
      console.log("Image upload response:", response);
      return response.data.fileName;
    } catch (error) {
      console.error("Error uploading image:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const addPost = async () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "You must be logged in to create a post",
      });
      return;
    }

    if (!description) {
      Swal.fire({
        icon: "error",
        title: "Description is mandatory",
      });
      return;
    }

    if (!location) {
      Swal.fire({
        icon: "error",
        title: "Location is mandatory",
      });
      return;
    }

    try {
      let imgFileName = "";
      if (image.data) {
        imgFileName = await handleImgUpload();
      }
      const request = {
        description,
        location,
        image: imgFileName ? `${API_BASE_URL}/files/${imgFileName}` : ""
      };

      console.log("Request data:", request);

      const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ);
      console.log("Post created:", postResponse.data);

      Swal.fire({
        icon: "success",
        title: "Post created successfully",
      });
      handleClose();
      getAllPosts();
    } catch (error) {
      console.error("Error creating post:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Failed to create post",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const getAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/allposts`);
      if (response.status === 200) {
        const sortedPosts = response.data.post.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAllPosts(sortedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  const deletePost = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
    if (response.status === 200) {
      getAllPosts();
    }
  };

  const retweetPost = async (postId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/retweet`, { postId }, CONFIG_OBJ);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Retweeted successfully",
        });
        getAllPosts();
      }
    } catch (error) {
      console.error("Error retweeting post:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Failed to retweet post",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  useEffect(() => {
    getAllPosts();
  },[]);

  return (
    <div className="feed-container">
      <div className="main-box border p-3">
        <nav className="nav-section d-flex justify-content-between align-items-center mb-3">
          <h2 className="home-text mb-0">Home</h2>
          {user ? <Button variant="primary" onClick={handleShow}>Tweet</Button> : null}
        </nav>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Tweet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTweetDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="What's happening?"
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formTweetLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(ev) => setLocation(ev.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formTweetImage">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={handleFileSelect} />
              </Form.Group>
              {image.preview && (
                <div className="image-preview mt-3">
                  <img src={image.preview} alt="Selected" style={{ maxWidth: '100%' }} />
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={addPost}>Tweet</Button>
          </Modal.Footer>
        </Modal>

       {loading ? ( 
          <div className="text-center mt-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : allposts.length > 0 ? (
          allposts.map((post) => (
            <div key={post._id}>
              <Alltweets postData={post} />
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
