import React, { useState } from "react";
import SignupForm from "../pages/sign-up";
import SigninForm from "../pages/sign-in";
import Home from "../pages/home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleUserLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleUserLogout = () => {
    setUser(null);
  };

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

      <SigninForm handleUserLogin={handleUserLogin} />

      {/* <SignupForm /> */}

      {/* {user ? (
        // If user is authenticated, display the Home component
        <Home user={user} handleUserLogout={handleUserLogout} />
      ) : (
        // If user is not authenticated, display the SigninForm component
        <SigninForm handleUserLogin={handleUserLogin} />
      )} */}

      {/* <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category" element={<ProductsList />} />
          <Route path="/products/details/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer /> */}
    </div>
  );
};

export default App;
