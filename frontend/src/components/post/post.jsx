import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from "../../config";
import { useSelector } from 'react-redux';
import './post.css'; 

const Post = (props) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const user = useSelector(state => state.userReducer.user);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post/${postId}`);
      setPost(response.data);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tweet-box border p-3 mt-3" style={{ cursor: "pointer" }}>
      <div className="d-flex">
        <Link to={`/profile/${post.author._id}`}>
          <div>
            <div className="profile-img-container">
              <img
                src={post.author.profileImg}
                alt="Profile"
                className="rounded-circle profile-img"
              />
            </div>
          </div>
        </Link>
        <div className="tweet-content ms-3">
          <div
            className="d-flex justify-content-between"
            style={{
              textDecoration: "none",
              color: "black",
              textTransform: "capitalize",
            }}
          >
            <h4>{post.author.name}</h4>
          </div>
          <p
            className="tweet-text"
            style={{
              textDecoration: "none",
              color: "black",
              textTransform: "capitalize",
            }}
          >
            {post.description}
          </p>
          <div className="tweet-img-box">
            {post.image && (
              <div className="tweet-image-container">
                <img
                  src={post.image}
                  alt="Post content"
                  className="img-fluid tweet-image"
                />
              </div>
            )}
          </div>
          <div className="tweet-actions d-flex justify-content-between mt-3">
            <FontAwesomeIcon
              icon={faRetweet}
              className="me-2"
              style={{ cursor: "pointer" }}
            />
            <div>{post.retweet}</div>
            <FontAwesomeIcon
              icon={faHeart}
              style={{ cursor: "pointer" }}
              className={`me-2 ${post.likes.includes(user._id) ? "text-danger" : ""}`}
            />
            {post.likes.length}
            <FontAwesomeIcon
              icon={faComment}
              className="me-2"
              style={{ cursor: "pointer" }}
            />
            <span>{post.comments.length}</span>
          </div>
        </div>
      </div>
      <div className="comments-section mt-3">
        <h5>Comments</h5>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="comment border p-2 mb-2"
            >
              <div className="d-flex">
                <div className="profile-img-container">
                  <img
                    src={comment.commentedBy.profileImg}
                    alt="Profile"
                    className="rounded-circle profile-img"
                  />
                </div>
                <div className="ms-3">
                  <div>
                    <h6
                      style={{
                        color: "black",
                        textTransform: "capitalize",
                      }}
                    >
                      {comment.commentedBy.name}
                    </h6>
                    <p style={{ fontSize: "13px" }}>
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <p>{comment.commentText}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Post;
