import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Mic, MicMute } from 'react-bootstrap-icons';

const VoiceExpenseInput = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onResult]);

  const toggleListening = () => {
    setError('');
    setIsListening(!isListening);
  };

  return (
    <div className="mb-3">
      <Button
        variant={isListening ? "danger" : "outline-primary"}
        onClick={toggleListening}
        className="d-flex align-items-center"
      >
        {isListening ? <MicMute className="me-2" /> : <Mic className="me-2" />}
        {isListening ? "Stop Recording" : "Voice Input"}
      </Button>
      {isListening && (
        <div className="mt-2 text-muted">
          Listening... Speak your expense (e.g., "Lunch 15 dollars")
        </div>
      )}
      {error && (
        <Alert variant="warning" className="mt-2">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default VoiceExpenseInput;