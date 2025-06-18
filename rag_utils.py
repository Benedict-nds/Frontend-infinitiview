import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import replicate
import os

# Listings from JSON data
current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, "real_estate_data.json")

with open(json_path, "r") as f:
    data = json.load(f)

listings = data["Companies_Dobiison(Collab)"]

# Descriptions 
docs = []
meta = []

for item in listings:
    desc = (
        f"Real Estate: {item.get('Real Estate Name', 'N/A')}\n"
        f"Community: {item.get('Community', 'N/A')}\n"
        f"Home Name: {item.get('Home Name', 'N/A')}\n"
        f"Status: {item.get('Status', 'N/A')}\n"
        f"Price: {item.get('Currency', '')}{item.get('Price', 'N/A')}\n"
        f"Bed-category: {item.get('bed-category', 'N/A')}\n"
        f"Bedrooms: {item.get('Bed rooms', item.get('Bedrooms', 'N/A'))}\n"
        f"Bathrooms: {item.get('Baths', item.get('Bathrooms', 'N/A'))}\n"
        f"Home Type: {item.get('Home Type', 'N/A')}\n"
        f"Location: {item.get('Location', 'N/A')}\n"
        f"Map: {item.get('URL location address', 'N/A')}\n"
        f"Area: {item.get('Area', 'N/A')}\n"
        f"Year Built: {item.get('Year Built', 'N/A')}\n"
        f"Payment Plan: {item.get('Payment Plan', 'N/A')}\n"
        f"Currency: {item.get('Currency', 'N/A')}\n"
        f"Features: {item.get('Features/Amenities', item.get('Amenities', 'N/A'))}\n"
        f"Infrastructure: {item.get('Infrastructure', 'N/A')}\n"
        f"Photos: {item.get('Photos', 'N/A')}\n"
        f"Video Tour: {item.get('Videos', 'N/A')}\n"
        f"Website: {item.get('Website URL', 'N/A')}\n"
    )
    docs.append(desc)
    meta.append(item)

# Embed Descriptions 
print("🔗 Embedding listings...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = embedder.encode(docs, convert_to_tensor=False)

#FAISS Index 
dim = len(embeddings[0])
index = faiss.IndexFlatL2(dim)
index.add(np.array(embeddings))


# Search Listings
def search_listings(query, top_k=2):
    query_embedding = embedder.encode([query])[0]
    D, I = index.search(np.array([query_embedding]), top_k)
    matches = [docs[i] for i in I[0]]
    return matches


# LLaMA 
os.environ["REPLICATE_API_TOKEN"] = os.getenv("REPLICATE_API_TOKEN")

def generate_answer(query):
    # Check if API token is set
    if not os.getenv("REPLICATE_API_TOKEN"):
        return "Error: REPLICATE_API_TOKEN not configured"
    
    results = search_listings(query)
    context = "\n\n".join(results)

    # Truncate to ~1500 words if too long
    if len(context.split()) > 1500:
        context = " ".join(context.split()[:1500])

    prompt = f"""A user asked: "{query}"

Here are some matching listings:\n{context}\n\n
Based on the provided information, please provide a helpful and accurate response."""

    print("🧠 Sending to LLaMA...")

    output = replicate.run(
        "meta/meta-llama-3-8b-instruct",
        input={
            "prompt": prompt,
            "temperature": 0.7,
            "top_p": 0.9,
            "max_new_tokens": 300,
            "system_prompt": """You are a helpful real estate assistant named 'Dobiison's Assistant'. 
Provide concise, accurate answers based on the given information. 
Be professional, helpful, and stick to real estate-related queries. 
If a question is outside the scope of the provided data, do a quick and deep search in the data. 
If you can't find the answer, respond with 'I am sorry, I do not have that information'.
If the question is not related to real estate, respond with 'I am a real estate assistant, I can only help with real estate related questions.'"""
        }
    )
    return "".join(output)

# "You are a helpful real estate assistant named 'Dobiison's Assistant'. "
# "Provide concise, accurate answers based on the given information. "
# "Be professional, helpful, and stick to real estate-related queries. "
# "If a question is outside the scope of the provided data, do a quick and deep search in the data. "
# "If you can't find the answer, "
# "respond with 'I am sorry, I do not have that information'."
# "If the question is not related to real estate, respond with 'I am a real estate assistant, I can 