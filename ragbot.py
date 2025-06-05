import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import T5Tokenizer, T5ForConditionalGeneration

# === Step 1: Load the JSON Data ===
with open("real_estate_data.json", "r") as f:
    listings = json.load(f)

# Fix: Access the list inside the main key
listings = listings["Companies_Dobiison(Collab)"]

# === Step 2: Create Descriptions ===
docs = []
meta = []
for item in listings:
    desc = (
        f"Real Estate: {item.get('Real Estate Name', 'N/A')}\n"
        f"Community: {item.get('Community', 'N/A')}\n"
        f"Home Name: {item.get('Home Name', 'N/A')}\n"
        f"Status: {item.get('Status', 'N/A')}\n"
        f"Price: {item.get('Currency', '')}{item.get('Price', 'N/A')}\n"
        f"bed-category: {item.get('bed-category', 'N/A')}\n"
        f"Bedrooms: {item.get('Bed rooms', item.get('Bedrooms', 'N/A'))}\n"
        f"Bathrooms: {item.get('Baths', item.get('Bathrooms', 'N/A'))}\n"
        f"Home Type: {item.get('Home Type', 'N/A')}\n"
        f"Location: {item.get('Location', 'N/A')}\n"
        f"Area: {item.get('Area', 'N/A')}\n"
        f"Year Built: {item.get('Year Built', 'N/A')}\n"
        f"Payment Plan: {item.get('Payment Plan', 'N/A')}\n"
        f"Features: {item.get('Features/Amenities', item.get('Amenities', 'N/A'))}\n"
        f"Website: {item.get('Website URL', 'N/A')}\n"
        f"Map: {item.get('URL location address', 'N/A')}\n"
        f"Photos: {item.get('Photos', 'N/A')}\n"
        f"Videos: {item.get('Videos', 'N/A')}\n"
        f"Contact: {item.get('Phone Number', 'N/A')} | Email: {item.get('Email address', 'N/A')}"
        f"Payment Plan: {item.get('Payment Plan', 'N/A')}\n"
    )
    docs.append(desc)
    meta.append(item)

# === Step 3: Embed Descriptions ===
print("Embedding listings...")
model_embed = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model_embed.encode(docs, convert_to_tensor=False)

# === Step 4: Build FAISS Index ===
embedding_dim = len(embeddings[0])
index = faiss.IndexFlatL2(embedding_dim)
index.add(np.array(embeddings))

# === Step 5: Accept Query and Embed ===
def search_listings(query, top_k=3):
    query_vec = model_embed.encode([query])[0]
    D, I = index.search(np.array([query_vec]), top_k)
    results = [docs[i] for i in I[0]]
    metadata = [meta[i] for i in I[0]]
    return results, metadata

# === Step 6: Generate a Smart Response Using Flan-T5 ===
print("Loading Flan-T5...")
flan_tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base")
flan_model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-base")

def generate_response(query):
    matches, meta = search_listings(query)
    listings_text = "\n\n".join(matches)
    prompt = (
        f"You are a real estate assistant. A user asked: '{query}'\n"
        f"Here are some matching listings:\n{listings_text}\n"
        f"Suggest the top option and explain why."
    )
    input_ids = flan_tokenizer(prompt, return_tensors="pt").input_ids
    outputs = flan_model.generate(input_ids, max_new_tokens=150)
    return flan_tokenizer.decode(outputs[0], skip_special_tokens=True)

# === Test Example ===
if __name__ == "__main__":
    user_query = "I'm looking for a 2-bedroom house in Kumasi under 100,000"
    reply = generate_response(user_query)
    print("\nAI Reply:", reply)
