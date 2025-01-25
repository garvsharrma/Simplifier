import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Notes from './pages/Notes';
import OCR from './pages/OCR';
import Chatbot from './pages/Chatbot';
import ImageProcessor from './pages/ImageProcessor';
import DetectAI from './pages/DetectAI';
import AIdetect from './pages/AIdetect';


const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/ocr" element={<OCR />} />
        <Route path="/ImageProcessor" element={<ImageProcessor />} />
        <Route path="/DetectAI" element={<DetectAI />} />
        <Route path="/AIdetect" element={<AIdetect />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
