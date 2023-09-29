import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/profile.module.css";
import { useParams, Link, Navigate } from "react-router-dom";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user); // Your user data from the store
  const [otherUser, setOtherUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const { userid } = useParams();

  // console.log("user id:",user._id);

  // Function to check if the current user is following the other user
  const checkIfFollowing = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/checkIfFollowing?userId=${userid}&currentUserId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsFollowing(result.isFollowing);
      } else {
        // Handle the case where the API call fails
        console.error("Failed to check if following:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const followUser = async (userIdToFollow) => {
    try {
      // Make an API call to follow the user
      const response = await fetch(
        `http://localhost:8000/user/follow/${userIdToFollow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId: user.id }),
        }
      );

      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        // const / = await response.json();
        setIsFollowing(true);

              // Fetch the updated follower and following counts
              fetchFollowerAndFollowingCounts(userid);


        // Add the followed user to the followersList
        // setFollowersList([...followersList, userIdToFollow]);
      } else {
        // Handle the case where the API call fails
        console.error("Failed to follow user:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      // Make an API call to unfollow the user
      const response = await fetch(
        `http://localhost:8000/user/unfollow/${userIdToUnfollow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId: user.id }),
        }
      );

      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        // const updatedUserData = await response.json();
        setIsFollowing(false);
        // Fetch the updated follower and following counts
         fetchFollowerAndFollowingCounts(userid);

        // Remove the unfollowed user from the followersList
        // const updatedFollowersList = followersList.filter(
        //   (followerId) => followerId !== userIdToUnfollow
        // );
        // setFollowersList(updatedFollowersList);
      } else {
        // Handle the case where the API call fails
        console.error("Failed to unfollow user:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };


  const fetchFollowerAndFollowingCounts = async (userId) => {
    try {
      // Fetch the updated follower and following counts
      const [followersResponse, followingResponse] = await Promise.all([
        fetch(`http://localhost:8000/user/followers/${userId}`),
        fetch(`http://localhost:8000/user/following/${userId}`),
      ]);
  
      if (followersResponse.ok) {
        const followersData = await followersResponse.json();
        setFollowersList(followersData.followers);
      } else {
        // Handle error
        console.error("Error fetching followers");
      }
  
      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        setFollowingList(followingData.following);
      } else {
        // Handle error
        console.error("Error fetching following");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };
  
  
  
  
  
  
  

  const sendMessage = (userIdToSendMessage) => {
    // Define your sendMessage logic here
    // For example, you can open a messaging component or make an API call to start a conversation
  };

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

  useEffect(() => {
    // Fetch user profile details by username from the backend
    const fetchUserProfile = async () => {
      try {
        const [profileResponse, followersResponse, followingResponse] =
          await Promise.all([
            fetch(`http://localhost:8000/user/profile/${userid}`),
            fetch(`http://localhost:8000/user/followers/${userid}`),
            fetch(`http://localhost:8000/user/following/${userid}`),
          ]);

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setOtherUser(userData);
          checkIfFollowing();
        } else {
          // Handle error
          console.error("Error fetching user profile");
        }

        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowersList(followersData.followers);
        } else {
          // Handle error
          console.error("Error fetching followers");
        }

        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowingList(followingData.following);
        } else {
          // Handle error
          console.error("Error fetching following");
        }
      } catch (error) {
        // Handle network error
        console.error("Network error:", error);
      }
    };

    fetchUserProfile();
  }, [userid]);

  if (!otherUser) {
    return <div>Loading...</div>; // You can add a loading state or error handling
  }

  const hasProfilePicture = otherUser.profilePicture;

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {hasProfilePicture ? (
          <img
            src={otherUser.profilePicture}
            alt={otherUser.username}
            className={styles.profilePicture}
          />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )}
        <h1 className={styles.username}>{otherUser.username}</h1>
        <p className={styles.name}>{otherUser.name}</p>
        <div className={styles.actionButtons}>
          {isFollowing ? (
            <button
              className={styles.unfollowButton}
              onClick={() => handleUnfollow(userid)}
            >
              Unfollow
            </button>
          ) : (
            <button
              className={styles.followButton}
              onClick={() => followUser(userid)}
            >
              Follow
            </button>
          )}
          <button
            className={styles.messageButton}
            onClick={() => sendMessage(otherUser.id)}
          >
            Message
          </button>
        </div>
      </div>
      <div className={styles.userDetails}>
        <p className={styles.userStats}>
          <span>
            <b>{otherUser.posts.length}</b>
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
        <p className={styles.bio}>{otherUser.bio}</p>
      </div>

      {showFollowersPopup && (
        <div className={styles.popupContainer} onClick={closeFollowersPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              {" "}
              <div>
                <h2>Followers</h2>
              </div>{" "}
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
                  {user.id === follower._id ? (
                      <Link to="/profile"> {follower.username} <div>{follower.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${follower._id}`}>
                        {follower.username} <div>{follower.name}</div>
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
              {" "}
              <div>
                <h2>Following</h2>
              </div>{" "}
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
                    {user.id === following._id ? (
                      <Link to="/profile"> {following.username}<div>{following.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${following._id}`}>
                        {following.username}<div>{following.name}</div>
                      </Link>
                    )}
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
