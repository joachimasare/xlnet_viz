from flask import Flask, request, jsonify
from transformers import XLNetTokenizer, XLNetLMHeadModel, top_k_top_p_filtering
import torch
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

# Load XLNet model and tokenizer
model = XLNetLMHeadModel.from_pretrained('xlnet-base-cased', output_attentions=True)
tokenizer = XLNetTokenizer.from_pretrained('xlnet-base-cased')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prompt = data.get('prompt', '')

    # Tokenize the input prompt
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)

    # Get model's output
    outputs = model(**inputs)
    attentions = outputs.attentions

    # Use top-k sampling for generating text
    logits = outputs.logits[:, -1, :]
    filtered_logits = top_k_top_p_filtering(logits, top_k=50)  # Top 50 tokens are considered
    probabilities = torch.nn.functional.softmax(filtered_logits, dim=-1)
    predicted_token = torch.multinomial(probabilities, 1)

    predicted_response = tokenizer.decode(predicted_token[0])

    # Get the token with highest attention from the last token in the input
    last_token_attention = attentions[-1][0][-1].detach().numpy()
    most_attended_token_id = np.argmax(last_token_attention)
    most_attended_token = tokenizer.decode([most_attended_token_id])

    # Convert attention weights to a list for frontend
    attention_list = [attention.squeeze(0).detach().numpy().tolist() for attention in attentions]

    response = {
        "attentions": attention_list,
        "most_attended_token": most_attended_token,
        "predicted_response": predicted_response
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
