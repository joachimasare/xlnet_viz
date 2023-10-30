import React, { useState } from 'react';
import axios from 'axios';
import AttentionVisualizer from './AttentionVisualizer';

function XLNetPrompter() {
  const [prompt, setPrompt] = useState('');
  const [attentions, setAttentions] = useState([]);
  const [mostAttendedToken, setMostAttendedToken] = useState('');
  const [predictedResponse, setPredictedResponse] = useState('');  // New state for predicted response

  const handlePredict = async () => {
      const response = await axios.post('http://localhost:5000/predict', { prompt });
      setAttentions(response.data.attentions);
      setMostAttendedToken(response.data.most_attended_token);
      setPredictedResponse(response.data.predicted_response);  // Update state with predicted response
  };

  return (
      <div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={handlePredict}>Predict</button>
          <div>Token with highest attention from last token: {mostAttendedToken}</div>
          <div>XLNet's Predicted Response: {predictedResponse}</div>  {/*Display the predicted response*/}
          <AttentionVisualizer attentions={attentions} />
      </div>
  );
}

export default XLNetPrompter;
