from transformers import T5Tokenizer, T5ForConditionalGeneration

# Load Flan-T5 base model
model_id = "google/flan-t5-base"
tokenizer = T5Tokenizer.from_pretrained(model_id)
model = T5ForConditionalGeneration.from_pretrained(model_id)

# Sample user prompt (real estate query)
input_text = (
    "You are a real estate assistant. "
    "The user is looking for property options. "
    "Suggest affordable 2-bedroom houses in Kumasi under 100,000 cedis."
)

# Prepare input for model
input_ids = tokenizer(input_text, return_tensors="pt").input_ids

# Generate output
outputs = model.generate(input_ids, max_new_tokens=50)

# Decode and print the response
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("AI:", response)