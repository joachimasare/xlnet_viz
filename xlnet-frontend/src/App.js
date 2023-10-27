import React, { useState } from 'react';
import axios from 'axios';
import AttentionVisualizer from './AttentionVisualizer';

function XLNetPrompter() {
  const [prompt, setPrompt] = useState('');
  const [attentions, setAttentions] = useState([]);
  const [mostAttendedToken, setMostAttendedToken] = useState('');  // New state

  const handlePredict = async () => {
      const response = await axios.post('/predict', { prompt });
      setAttentions(response.data.attentions);
      setMostAttendedToken(response.data.most_attended_token);  // Update state
  };

  return (
      <div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={handlePredict}>Predict</button>
          <div>Token with highest attention from last token: {mostAttendedToken}</div>
          <AttentionVisualizer attentions={attentions} />
      </div>
  );
}


export default XLNetPrompter;
