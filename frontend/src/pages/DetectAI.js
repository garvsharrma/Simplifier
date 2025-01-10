import '../styles/DetectAI.css';
import { useEffect } from 'react';
import { Sapling } from '@saplingai/sapling-js/observer';

function DetectAI() {
  useEffect(() => {
    Sapling.init({
      endpointHostname: 'http://127.0.0.1:5000',
      saplingPathPrefix: '/sapling',
    });

    const editor = document.getElementById('editor');
    Sapling.observe(editor);
  }, []);

  return (
    <>
    <div className="detect-ai-container">
    <h1 className="title">AI-Assisted Text Editor</h1><div
          id="editor"
          sapling-ignore="true"
          contentEditable="true"
          className="editor-container"
      >
          Start typing here for AI-powered suggestions...
      </div><footer className="footer">
              Powered by <a href="https://sapling.ai" target="_blank" rel="noopener noreferrer">Simplifier</a>
          </footer></div>
          </>
  );
}

export default DetectAI;
