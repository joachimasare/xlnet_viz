from flask import Flask, request, jsonify
from transformers import GPT2Tokenizer, GPT2LMHeadModel  # We're switching to GPT-2 classes
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load GPT-2 model and tokenizer
model = GPT2LMHeadModel.from_pretrained('gpt2-medium', output_attentions=True)  # Using 'gpt2-medium' for demonstration
tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prompt = data.get('prompt', '')

    # Tokenize the input prompt
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)

    # Get model's output
    outputs = model(**inputs)
    attentions = outputs.attentions

    # Get the model's predicted response
    predicted_response_tokens = outputs.logits.argmax(dim=-1)
    predicted_response = tokenizer.decode(predicted_response_tokens[0])

    # get the token with highest attention from the last token in the input
    last_token_attention = attentions[-1][0][-1]
    most_attended_token_id = torch.argmax(last_token_attention).item()
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
