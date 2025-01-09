import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (

<nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Apna Cafe</Link>
        <div className="navbar-links">
        <Link to="/" >Home</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/ocr" >OCR</Link>
        <Link to="/chatbot">Chatbot</Link>
        </div>
      </div>
    </nav>


    // <nav style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
    //   <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
    //   <Link to="/notes" style={{ marginRight: '15px' }}>Notes</Link>
    //   <Link to="/ocr" style={{ marginRight: '15px' }}>OCR</Link>
    //   <Link to="/chatbot">Chatbot</Link>
    // </nav>
  );
};

export default Navbar;
