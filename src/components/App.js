import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import SignupForm from "../pages/sign-up";
import SigninForm from "../pages/sign-in";
import Menu from "../pages/menu";
import Home from "../pages/home";
import CreatePost from "../pages/create";
import UserProfile from "../pages/userprofile";
import SearchComponent from "../pages/search";
import Profile from "../pages/profile";
import Message from "../pages/messages";
import {Route, Routes,useLocation} from 'react-router-dom';
import styles from "../styles/app.module.css";
import { logout } from '../actions/index';




import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation(); 
  const dispatch = useDispatch();



  const handleUserLogout = async () => {
    try {
      // Make an API call to destroy the session on the backend
      const response = await fetch("http://localhost:8000/user/logout", {
        method: "GET", // You can use the appropriate HTTP method
        headers: {
          // Add any headers required for your API call
          "Content-Type": "application/json",
          // Add any authorization headers if needed
          // "Authorization": `Bearer ${accessToken}`,
        },
      });
  
      if (response.ok) {
        // Session is successfully destroyed on the backend
        // Now, set the user to null in your state
        dispatch(logout());
        toast.success("Logged out successfully");
        window.location.href = "/signin";
      } else {
        // Handle the case where the API call fails
        console.error("Failed to logout:", response.status);
      }
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };
  

    // Determine whether to show the menu based on the current route
    const showMenu =
    location.pathname !== "/signin" && location.pathname !== "/signup";

  return (
    <div className="App">
      <ToastContainer // for notifications
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />



        {showMenu && <Menu  handleUserLogout={handleUserLogout} />}

       <div className={styles.ContentContainer}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile  user={user} />} />
          {/* <Route path="/notifications" element={<Notifications />} /> */}
          <Route path="/create" element={<CreatePost />} />
          <Route path="/search" element={<SearchComponent />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/messages/:userId" element={<Message />} />
          <Route
            path="/signin"
            element={<SigninForm />}
          />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/user/profile/:userid" element={<UserProfile />} />
        </Routes>
      </div>


      {/* {user ? (
        // If user is authenticated, display the Home component
        <Home user={user} handleUserLogout={handleUserLogout} />
      ) : (
        // If user is not authenticated, display the SigninForm component
        <SigninForm handleUserLogin={handleUserLogin} />
      )} */}

    </div>
  );
};

export default App;
