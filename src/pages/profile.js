import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/profile.module.css';

const Profile = ({ isOwnProfile }) => {
  const user = useSelector((state) => state.user.user);
  const hasProfilePicture = user && user.profilePicture;
  isOwnProfile=true;

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {hasProfilePicture ? (
          <img src={user.profilePicture} alt={user.username} className={styles.profilePicture} />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )}
        <h1 className={styles.username}>{user.username}</h1>
        <p className={styles.name}>{user.name}</p>

        {isOwnProfile ? (
          // Render "Edit Profile" button for your own profile
          <button className={styles.editProfileButton}>Edit Profile</button>
        ) : (
          // Render "Follow" and "Message" buttons for other profiles
          <div className={styles.actionButtons}>
            {/* <button className={styles.followButton}>Follow</button>
            <button className={styles.messageButton}>Message</button> */}
          </div>
        )}
      </div>
      <div className={styles.userDetails}>
        <p className={styles.userStats}>
          <span>{user.posts}</span> posts
        </p>
        <p className={styles.userStats}>
          <span>{user.followers}</span> followers
        </p>
        <p className={styles.userStats}>
          <span>{user.following}</span> following
        </p>
        <p className={styles.bio}>{user.bio}</p>
      </div>
    </div>
  );
};

export default Profile;
