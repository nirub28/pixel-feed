import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/profile.module.css";
import { Link } from "react-router-dom";
import { updateUser } from '../actions/index';


const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const hasProfilePicture = user && user.profilePicture;
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false); //showProfileEdit state

  // State variables for profile edit form
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || ""
  );
  const [bio, setBio] = useState(user.bio || "");



  // Function to fetch followers and following data for the logged-in user
  const fetchFollowersAndFollowing = async () => {
    try {
      // Replace with actual API calls to fetch followers and following lists
      // For example:
      const followersResponse = await fetch(
        `http://localhost:8000/user/followers/${user.id}`
      );
      const followingResponse = await fetch(
        `http://localhost:8000/user/following/${user.id}`
      );

      if (followersResponse.ok && followingResponse.ok) {
        const followersData = await followersResponse.json();
        const followingData = await followingResponse.json();
        setFollowersList(followersData.followers);
        setFollowingList(followingData.following);
      } else {
        console.error("Failed to fetch followers and following");
      }
    } catch (error) {
      console.error("Error fetching followers and following:", error);
    }
  };

  useEffect(() => {
    fetchFollowersAndFollowing();
  });

  const openFollowersPopup = () => {
    setShowFollowersPopup(true);
  };

  const closeFollowersPopup = () => {
    setShowFollowersPopup(false);
  };

  const openFollowingPopup = () => {
    setShowFollowingPopup(true);
  };

  const closeFollowingPopup = () => {
    setShowFollowingPopup(false);
  };

  // Function to handle opening the profile edit form
  const openProfileEdit = () => {
    setShowProfileEdit(true);
  };

  // Function to handle closing the profile edit form
  const closeProfileEdit = () => {
    setShowProfileEdit(false);
  };

  const handleFileInputChange = (e) => {
    e.stopPropagation(); 
    setProfilePicture(e.target.files[0]); 
  };
  

  // Function to handle profile update form submission
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      if (bio) {
        formData.append('bio', bio);
      }
  
      const response = await fetch(
        `http://localhost:8000/user/update-profile/${user.id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );
  
      if (response.ok) {
        // Handle successful update
        const updatedUserData = await response.json();
        dispatch(updateUser(updatedUserData.user));
        setShowProfileEdit(false);
      } else {
        // Handle the case where the API call fails
        console.error('Failed to update profile:', response.status);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };
  

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {hasProfilePicture ? (
          <img
            src={user?.profilePicture || "https://img.icons8.com/fluency/48/test-account.png"}
            alt={user?.username}
            className={styles.profilePicture}
          />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )}
        <h1 className={styles.username}>{user.username}</h1>
        <p  className={styles.name}>{user.name}</p>
        {/* Render "Edit Profile" button for your own profile */}
        <button className={styles.editProfileButton} onClick={openProfileEdit}>
          Edit Profile
        </button>
      </div>
      <div className={styles.userDetails}>
        <p className={styles.userStats}>
          <span>
            <b>{user.posts}</b>
          </span>{" "}
          posts
        </p>
        <p className={styles.userStats} onClick={openFollowersPopup}>
          <span>
            <b>{followersList.length}</b>
          </span>{" "}
          followers
        </p>
        <p className={styles.userStats} onClick={openFollowingPopup}>
          <span>
            <b>{followingList.length}</b>
          </span>{" "}
          following
        </p>
        <p className={styles.bio}>{user.bio}</p>
      </div>

      {showFollowersPopup && (
        <div className={styles.popupContainer} onClick={closeFollowersPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              <div>
                <h2>Followers</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeFollowersPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followersList.map((follower) => (
                <li key={follower._id}>
                  <img
                    src={
                      follower.profilePicture ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={follower.username}
                  />
                  <div className={styles.divName}>
                    <Link to={`/user/profile/${follower._id}`}>
                      {follower.username}
                    </Link>
                    <span>{follower.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showFollowingPopup && (
        <div className={styles.popupContainer} onClick={closeFollowingPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              <div>
                <h2>Following</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeFollowingPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followingList.map((following) => (
                <li key={following._id}>
                  <img
                    src={
                      following.profilePicture ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={following.username}
                  />
                  <div className={styles.divName}>
                    <Link to={`/user/profile/${following._id}`}>
                      {following.username}
                    </Link>
                    <span>{following.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showProfileEdit && (
        // Profile edit form
        <div className={styles.popupContainer} >
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              <div>
                <h2>Edit Profile</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeProfileEdit}>
                Close
              </div>
            </div>
            <hr />
            <div className={styles.profileEditForm}>
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*" // to Specify that only image files are allowed
                  onChange={handleFileInputChange} 
              />
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                className={styles.saveProfileButton}
                onClick={handleProfileUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
