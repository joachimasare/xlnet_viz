import React, { useState } from 'react';
import axios from 'axios';

function FeedbackForm() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async () => {
        // Example: sending feedback to a backend endpoint
        await axios.post('/feedback', { feedback });
    };

    return (
        <div>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            <button onClick={handleSubmit}>Submit Feedback</button>
        </div>
    );
}

export default FeedbackForm;
