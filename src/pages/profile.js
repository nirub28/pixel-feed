import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/profile.module.css";
import { Link } from "react-router-dom";
import { updateUser } from '../actions/index';



const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const hasProfilePicture = user && user.profilePicture;
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false); //showProfileEdit state
  const [followersListDetails, setFollowersList] = useState([]);
  const [followingListDetails, setFollowingList] = useState([]);

  const [image, setImage] = useState('');


  // State variables for profile edit form
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || ""
  );

  console.log("user:", user);

  const [bio, setBio] = useState(user.bio || "");
  const followersList = user.followers || [];
  const followingList = user.following || [];

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

  function converToBase64 (e){
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload=()=>{
      setImage(reader.result);
    }
    reader.onerror = error =>{
      console.log("error", error);
    }
  }


  //get user details fo followers and following
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/user/profile/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        // Handle error
        console.error("Error fetching user profile");
        return null;
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
      return null;
    }
  };
  

  // Function to handle profile update form submission
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      if (profilePicture) {
        // Append the image (base64 string) to the form data with the key 'profilePicture'
        formData.append('profilePicture', image);
      }
      if (bio) {
        // Append the bio to the form data with the key 'bio'
        formData.append('bio', bio);
      }
  
      // Send the form data to the backend
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
  
        // Dispatch only the profilePicture and bio to the reducer
        dispatch(updateUser(updatedUserData.user.profilePicture, updatedUserData.user.bio));
  
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
  




// Function to fetch and update follower and following details
const fetchFollowerDetails = async () => {
  const followerDetails = [];
  for (const followerId of followersList) {
    const user = await fetchUserById(followerId);
    if (user) {
      followerDetails.push(user);
    }
  }
  setFollowersList(followerDetails);
};

const fetchFollowingDetails = async () => {
  const followingDetails = [];
  for (const followingId of followingList) {
    const user = await fetchUserById(followingId);
    if (user) {
      followingDetails.push(user);
    }
  }
  setFollowingList(followingDetails);
};

// Call these functions to fetch follower and following details 
useEffect(() => {
  fetchFollowerDetails();
  fetchFollowingDetails();
}, []);


///  || "https://img.icons8.com/fluency/48/test-account.png"

console.log("image is:", user.profilePictureToShow.toString("base64"));


  

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
      <img
     src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=600"
  alt={user?.username}
  className={styles.profilePicture}
/>
        {/* {hasProfilePicture ? (
          <img
            src={`data:image/jpeg;base64,${user.profilePictureToShow.toString("base64")}`}
            alt={user?.username}
            className={styles.profilePicture}
          />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )} */}
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
              {followersListDetails.map((follower) => (
                <li key={follower._id}>
                  <img
                    src={
                      follower.profilePicture ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={follower.username}
                  />
                  <div className={styles.divName}>
                  {user.id === follower._id ? (
                      <Link to="/profile"> {follower.username}<div>{follower.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${follower._id}`}>
                        {follower.username}<div>{follower.name}</div>
                      </Link>
                    )}
                    
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
              {followingListDetails.map((following) => (
                <li key={following._id}>
                  <img
                    src={
                      following.profilePicture ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={following.username}
                  />
                  <div className={styles.divName}>
                  {user.id === following._id ? (
                      <Link to="/profile"> {following.username}<div>{following.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${following._id}`}>
                        {following.username}
                        <div>{following.name}</div>
                      </Link>
                    )}
                    
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
            <form className={styles.profileEditForm}> 
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*" // to Specify that only image files are allowed
                  // onChange={handleFileInputChange} 
                 onChange={converToBase64} 
              />
              {image==''|| image==null?"": <img width={100} height={100} src={image} />}
              
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
