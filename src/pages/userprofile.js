import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/profile.module.css';
import { useParams } from 'react-router-dom';


const UserProfile = () => {
  const user = useSelector((state) => state.user.user); // Your user data from the store
  const dispatch = useDispatch();
  const [otherUser, setOtherUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userid } = useParams();

//   console.log("user id is",userid )

// Function to check if the current user is following the other user
const checkIfFollowing = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/checkIfFollowing/${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIsFollowing(result.isFollowing);
      } else {
        // Handle the case where the API call fails
        console.error('Failed to check if following:', response.status);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };


  const followUser = async (userIdToFollow) => {
    try {
      // Make an API call to follow the user
      const response = await fetch(`http://localhost:8000/user/follow/${userIdToFollow}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can include any necessary data in the request body
        // For example, you can send the current user's ID
        body: JSON.stringify({ currentUserId: user.id }),
      });
  
      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        const updatedUserData = await response.json();
        // Dispatch an action to update the user data in the Redux store
        // You should have an action type and payload to handle this
        dispatch({ type: 'UPDATE_USER_DATA', payload: updatedUserData });
      } else {
        // Handle the case where the API call fails
        console.error('Failed to follow user:', response.status);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  //unfollow user
  const handleUnfollow = async (userid) => {
    try {
      // Make an API call to unfollow the user
      const response = await fetch(`http://localhost:8000/user/unfollow/${userid}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: user.id }),
      });
  
      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        const updatedUserData = await response.json();
        // Dispatch an action to update the user data in the Redux store
        // You should have an action type and payload to handle this
        dispatch({ type: 'UPDATE_USER_DATA', payload: updatedUserData });
        // Set isFollowing to false after unfollowing
        setIsFollowing(false);
      } else {
        // Handle the case where the API call fails
        console.error('Failed to unfollow user:', response.status);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };
  
  

  const sendMessage = (userIdToSendMessage) => {
    // Define your sendMessage logic here
    // For example, you can open a messaging component or make an API call to start a conversation
  };

  useEffect(() => {
    // Fetch user profile details by username from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/profile/${userid}`);
        if (response.ok) {
          const userData = await response.json();
        //   console.log("user", userData);
          setOtherUser(userData);
          checkIfFollowing();
        } else {
          // Handle error
          console.error('Error fetching user profile');
        }
      } catch (error) {
        // Handle network error
        console.error('Network error:', error);
      }
    };

    fetchUserProfile();
  }, [userid]);

  if (!otherUser) {
    return <div>Loading...</div>; // You can add a loading state or error handling
  }

  const hasProfilePicture = otherUser.profilePicture;

  const handleFollow = () => {
    // Dispatch a followUser action here to follow the other user
    followUser(userid);
  };

  const handleUnFollow = () => {
    // Dispatch a followUser action here to follow the other user
    handleUnfollow(userid);
  };

  const handleMessage = () => {
    // Dispatch a sendMessage action here to start a conversation with the other user
    sendMessage(otherUser.id);
  };

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {hasProfilePicture ? (
          <img src={otherUser.profilePicture} alt={otherUser.username} className={styles.profilePicture} />
        ) : (
          <img src="https://img.icons8.com/fluency/48/test-account.png" alt="Default" className={styles.profilePicture} />
        )}
        <h1 className={styles.username}>{otherUser.username}</h1>
        <p className={styles.name}>{otherUser.name}</p>
          <div className={styles.actionButtons}>
          {isFollowing ? (
            <button className={styles.unfollowButton} onClick={handleUnFollow}>
              Unfollow
            </button>
          ) : (
            <button className={styles.followButton} onClick={handleFollow}>
              Follow
            </button>
          )}
          <button className={styles.messageButton} onClick={handleMessage}>
            Message
          </button>
          </div>
        
      </div>
      <div className={styles.userDetails}>
        <p className={styles.userStats}>
          <span>{otherUser.posts}</span> posts
        </p>
        <p className={styles.userStats}>
          <span>{otherUser.followers}</span> followers
        </p>
        <p className={styles.userStats}>
          <span>{otherUser.following}</span> following
        </p>
        <p className={styles.bio}>{otherUser.bio}</p>
      </div>
    </div>
  );
};

export default UserProfile;
