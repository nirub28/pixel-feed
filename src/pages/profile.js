import React from 'react';
import styles from '../styles/profile.module.css';

const Profile = ({ user, isOwnProfile }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.username} className={styles.profilePicture} />
        ) : (
          <img src="https://img.icons8.com/fluency/48/test-account.png" alt="Default" className={styles.profilePicture} />
        )}
        <h1 className={styles.username}>{user.username}</h1>
        <p className={styles.name}>{user.name}</p>
        {!isOwnProfile && (
          <div className={styles.actionButtons}>
            <button className={styles.followButton}>Follow</button>
            <button className={styles.messageButton}>Message</button>
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
