// import React, { useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { API_BASE_URL } from "../../config";

// const CommentModal = ({ show, handleClose, postId, updatePost }) => {
//   const [commentText, setCommentText] = useState("");

//   const submitComment = async () => {
//     if (!commentText) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Comment cannot be empty!",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/comment`, {
//         postId,
//         comment: commentText,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "Comment added successfully!",
//         });
//         updatePost(response.data); // Update the post with new comments
//         setCommentText("");
//         handleClose();
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Error adding comment!",
//       });
//       console.error(error);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Add Comment</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group>
//             <Form.Label>Comment</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//             />
//           </Form.Group>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={submitComment}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default CommentModal;
