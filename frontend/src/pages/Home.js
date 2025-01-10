import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="homepage-container">
      {/* Left Section */}
      <div className="homepage-left">
        <h2>Welcome to </h2>
        <h1>The Student Simplifier</h1>
        <p>Your AI-powered assistant to simplify daily tasks</p>
      </div>

      {/* Right Section */}
      <div className="homepage-right">
      <h5>What's in your mind today?</h5>
        <button onClick={() => window.location.href = '/chatbot'}>Ask Bot 🤖</button>
        <button onClick={() => window.location.href = '/ImageProcessor'}>Prompt Image 🗎</button>
        <button onClick={() => window.location.href = '/detectAI'}>AI-Assisted Text Editor</button>
        <button onClick={() => window.location.href = '/features'}>Explore Features</button>

      </div>
    </div>
  );
};

export default Home;
