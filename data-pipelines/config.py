"""Configuration for the word categorization pipeline."""
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "models/embedding-001"  # Gemini embedding model

# Clustering Configuration
NUM_CLUSTERS = 10  # Adjust based on experimentation
RANDOM_SEED = 42

# File Paths
INPUT_FILE = "../public/indian_words.txt"
OUTPUT_FILE = "../public/categorized_words.json"
CACHE_DIR = "./cache"
EMBEDDINGS_CACHE = os.path.join(CACHE_DIR, "embeddings.npy")
WORDS_CACHE = os.path.join(CACHE_DIR, "words.json")

# Processing Configuration
BATCH_SIZE = 100  # For API requests
USE_CACHE = True  # Set to False to regenerate embeddings

print(f"GEMINI_API_KEY: {GEMINI_API_KEY}")
print(f"EMBEDDING_MODEL: {EMBEDDING_MODEL}")
print(f"NUM_CLUSTERS: {NUM_CLUSTERS}")
print(f"RANDOM_SEED: {RANDOM_SEED}")
print(f"INPUT_FILE: {INPUT_FILE}")
print(f"OUTPUT_FILE: {OUTPUT_FILE}")
print(f"CACHE_DIR: {CACHE_DIR}")
print(f"EMBEDDINGS_CACHE: {EMBEDDINGS_CACHE}")
print(f"WORDS_CACHE: {WORDS_CACHE}")
print(f"BATCH_SIZE: {BATCH_SIZE}")
print(f"USE_CACHE: {USE_CACHE}")