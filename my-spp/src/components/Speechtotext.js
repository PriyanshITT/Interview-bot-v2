import React, { useState, useEffect, useRef } from 'react';

const SpeechToText = () => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef(null);
  // Use a ref to reliably hold the current listening state for event handlers.
  const listeningRef = useRef(isListening);

  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Check if the browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    // Initialize SpeechRecognition instance
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    // Process the speech recognition results
    recognition.current.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setFinalTranscript(prev => prev + final);
      setInterimTranscript(interim);
    };

    // Enhanced error handling: alert the user on network errors.
    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'network') {
        alert('Network error: Please check your internet connection and try again.');
      }
    };

    // Restart recognition automatically if it ends unexpectedly while still listening.
    recognition.current.onend = () => {
        if (listeningRef.current) {
          // Add a slight delay before restarting
          setTimeout(() => {
            recognition.current.start();
          }, 400); // 500 milliseconds delay
        } else {
          setIsListening(false);
        }
      };
      
  }, []);

  // Toggle listening on/off when clicking the button.
  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      // Optionally, clear previous transcripts
      setFinalTranscript('');
      setInterimTranscript('');
      setIsListening(true);
      recognition.current.start();
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button 
        onClick={toggleListening} 
        style={{ fontSize: '1.5rem', padding: '10px 20px', cursor: 'pointer' }}>
        {isListening ? 'Stop Mic' : 'Start Mic'}
      </button>
      <div 
        style={{ 
          marginTop: '20px', 
          width: '80%', 
          margin: '20px auto', 
          backgroundColor: '#f9f9f9',
          padding: '15px', 
          border: '2px solid #333', 
          borderRadius: '8px',
          fontSize: '1.2rem',
          color: '#000'
        }}
        aria-live="polite"
      >
        <div>
          <strong>Final Transcript:</strong>
          <div>{finalTranscript}</div>
        </div>
        
      </div>
    </div>
  );
};

export default SpeechToText;
