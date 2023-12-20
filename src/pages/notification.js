// NotificationPage.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/notification.module.css";

const NotificationPage = () => {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);

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
                  liked your post.
                </p>
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
    </div>
  );
};

export default NotificationPage;
