// ImagePopup.js
import React, { useEffect, useState } from "react";
import styles from "../styles/ImagePopup.module.css";

const ImagePopup = ({ imageId, onClose }) => {
  const [imageDetails, setImageDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Define an async function to fetch image details and comments
    const fetchImageDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/post/info/${imageId}`
        );

        if (response.ok) {
          const data = await response.json();
          //   console.log("response :",data);
          setPost(data);
          setImageDetails(data);
          setComments(data.comments);
          getUserDetails(data.user);
        } else {
          console.error("Error fetching image details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image details:", error);
      }
    };

    // Call the async function to fetch image details and comments
    fetchImageDetails();
  }, [imageId]);

  const getUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/profile/${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        // console.log("response :", data);
        setUser(data);
        // console.log("user is", user);
      } else {
        console.error("Error fetching user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (!imageDetails) {
    return null; // Loading or error handling can be added here
  }

  return (
    <div className={styles.imagePopupOverlay}>
      <div className={styles.imagePopup}>
        <div className={styles.imageContainer}>
          <img src={imageDetails.image} alt="Post" className={styles.image} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <img
              src={
                user.profilepic ||
                "https://img.icons8.com/fluency/48/test-account.png"
              }
              alt="User Profile"
              className={styles.userProfilePic}
            />
            <p className={styles.username}>{user.username}</p>
          </div>
          <p className={styles.caption}>
            {" "}
            <b>Caption :</b>
            {imageDetails.caption}
          </p>
          <hr />
          <div className={styles.commentsSection}>
            {comments.length === 0 ? (
              <>
              <p className={styles.noComments}><b>No comments yet.</b></p>
              <p className={styles.startConversation}>Start the conversation below</p>
            </>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <img
                    src={comment.user.profilepic || "default-profile-pic-url.jpg"}
                    alt="User Profile"
                    className={styles.commentUserProfilePic}
                  />
                  <p className={styles.commentUsername}>{comment.user.username}</p>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            )}
          </div>
         <hr />
          <div className={styles.likesAndComments}>
            <img
              src="https://cdn-icons-png.flaticon.com/256/2961/2961957.png"
              alt="Likes"
              className={styles.likesIcon}
            />
            <p>{comments.length}likes</p>
            <img
              src="https://cdn-icons-png.flaticon.com/256/3031/3031126.png"
              alt="Comments"
              className={styles.commentsIcon}
            />
          </div>
          <hr />
          <form className={styles.commentForm}>
            <input
              type="text"
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentSubmit}>
              Post
            </button>
          </form>
          <b onClick={onClose} className={styles.closeButton}>X</b>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
