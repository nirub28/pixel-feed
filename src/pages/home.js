import React from 'react';

const Home = ({ props }) => {
  return (
    <div>
      <h1>Hello, {props.user}!</h1>
      <p>Welcome to our website. You are now logged in.</p>
      {/* Add more user-specific content or features here */}
    </div>
  );
};

export default Home;
