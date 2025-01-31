import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AIDetect.css';

function AIdetect() {
  const [inputText, setInputText] = useState('');
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDetectionResult(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/aidetect`, {
        text: inputText,
      });

      const { data } = response;
      setDetectionResult(data);
    } catch (err) {
      const errMsg = err.response?.data?.msg || 'An error occurred. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getColorForScore = (score) => {
    if (score > 0.8) return "#DE3163";
    if (score > 0.3) return '#fda21f';
    return 'green';
  };

  return (
    <div className="ai-detector-container">
      <h1>AI Content Detector</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to analyze..."
          className="input-textarea"
        />
        <div className="character-counter">Character Count: {inputText.length}</div>
        <button type="submit" disabled={loading} className="detect-button">
          {loading ? (
            <>
              <span className="spinner"></span> Analyzing...
            </>
          ) : (
            'Detect AI Content'
          )}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {detectionResult && (
        <div className="result-container">
          <h2>Detection Results</h2>
          <p><strong>Overall Score:</strong> {((detectionResult.score) * 100).toFixed(2)}%</p>
          {detectionResult.sentence_scores && (
            <div className="sentence-scores">
              <h3>Per-Sentence Scores:</h3>
              <ul>
                {detectionResult.sentence_scores.map((sentence, index) => (
                  <li key={index} style={{ color: getColorForScore(sentence.score), padding: '5px', borderRadius: '5px', marginBottom: '10px' }}>
                    <strong>Sentence:</strong> {sentence.sentence}<br />
                    <strong>Score:</strong> {((sentence.score) * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIdetect;
