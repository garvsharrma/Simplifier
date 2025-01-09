import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleExtractText = () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setLoading(true);
    Tesseract.recognize(selectedFile, 'eng', {
      logger: (info) => console.log(info), // Logs progress
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleGetSolution = async () => {
    if (!text) {
      alert('Extract text first!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/solutions/get-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSolution(data.solution);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>OCR with Solution Generator</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleExtractText} style={{ marginLeft: '10px' }}>
        Extract Text
      </button>

      {loading && <p>Processing...</p>}

      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <textarea
            value={text}
            readOnly
            style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          />
          <button onClick={handleGetSolution}>Get Solution</button>
        </div>
      )}

      {solution && (
        <div>
          <h2>Solution:</h2>
          <textarea
            value={solution}
            readOnly
            style={{ width: '100%', height: '200px' }}
          />
        </div>
      )}
    </div>
  );
};

export default OCR;
