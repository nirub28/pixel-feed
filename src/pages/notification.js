// NotificationPage.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/notification.module.css";
import ImagePopup from "./imagepop";

const NotificationPage = () => {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // console.log("not", notifications);

  useEffect(() => {
    // Fetch notifications for the logged-in user
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/notification/user/${user.id}`
        );

        if (response.ok) {
          const notificationData = await response.json();
          console.log("not", notificationData);
          setNotifications(notificationData);
        } else {
          console.error("Error fetching notifications:", response.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchNotifications();
  }, [user.id]);




  // Assume you have a function to make API calls, e.g., fetchNotifications or axios
const deleteNotifications = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/delete-notifications/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Notifications deleted successfully');
    } else {
      console.error('Error deleting notifications:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
};

const userId = user.id; 

// Set a timer to delete notifications after 5 minutes
setTimeout(() => {
  deleteNotifications(userId);
}, 5 * 60 * 1000); // 5 minutes in milliseconds


  return (
    <div className={styles.notificationContainer}>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className={styles.notificationItem}>
            <img
              src={
                notification.sender.profilepic ||
                "https://img.icons8.com/fluency/48/test-account.png"
              }
              alt="Sender Profile"
              className={styles.notificationProfilePic}
            />
            <div className={styles.notificationContent}>
              {/* Customize the display based on the notification type */}
              {notification.type === "like" && (
                <div className={styles.div1}>
                  <div>
                    <span
                      className={styles.notificationUsername}
                      onClick={() => {
                        const profileRedirectUrl =
                          notification.sender._id === user.id
                            ? `/profile`
                            : `/user/profile/${notification.sender._id}`;
                        window.location.href = profileRedirectUrl;
                      }}
                    >
                      {notification.sender.username}
                    </span>{" "}
                    liked your post.
                  </div>
                  <div onClick={() => setSelectedImage(notification.postId._id)}>
                    <img
                      className={styles.smallimg}
                      src={notification.postId.image}
                    ></img>
                  </div>
                </div>
              )}
              {notification.type === "comment" && (
                <p>
                  <span
                    className={styles.notificationUsername}
                    onClick={() => {
                      const profileRedirectUrl =
                        notification.sender._id === user.id
                          ? `/profile`
                          : `/user/profile/${notification.sender._id}`;
                      window.location.href = profileRedirectUrl;
                    }}
                  >
                    {notification.sender.username}
                  </span>{" "}
                  commented on your post.
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedImage !== null && (
        <ImagePopup
          imageId={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default NotificationPage;
