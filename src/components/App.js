import React, { useState } from "react";
import SignupForm from "../pages/sign-up";
import SigninForm from "../pages/sign-in";
import Menu from "../pages/menu";
import Home from "../pages/home";
import Create from "../pages/create";
import Profile from "../pages/profile";
import {Route, Routes,useLocation} from 'react-router-dom';
import styles from "../styles/app.module.css";




import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation(); 

  const handleUserLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleUserLogout = () => {
    setUser(null);
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



        {showMenu && <Menu />}

       <div className={styles.ContentContainer}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/notifications" element={<Notifications />} /> */}
          <Route path="/create" element={<Create />} />
          {/* <Route path="/wishlist" element={<Wishlist />} /> */}
          <Route
            path="/signin"
            element={<SigninForm handleUserLogin={handleUserLogin} />}
          />
          <Route path="/signup" element={<SignupForm />} />
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
