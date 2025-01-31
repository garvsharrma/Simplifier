import React, { useState } from 'react';
import '../styles/ImageProcessor.css'; // Style file for better UI

const ImageProcessor = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image || !prompt.trim()) {
      alert('Please provide both an image and a prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/process-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.reply);
      } else {
        setResponse('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-processor-container">
      <h1>Image and Prompt Processor</h1>

      <div className="form">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {response && (
        <div className="response">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;
