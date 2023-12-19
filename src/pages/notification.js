// NotificationPage.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/notification.module.css";

const NotificationPage = () => {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);

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
            {/* Customize the display based on the notification type */}
            {notification.type === "like" && (
              <p>{notification.sender.username} liked your post.</p>
            )}
            {notification.type === "comment" && (
              <p>{notification.sender.username} commented on your post.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
