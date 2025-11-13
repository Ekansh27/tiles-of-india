"""Embedding generation using Google Gemini API."""
import time
import numpy as np
import pickle
import os
from google import genai
from google.genai import types
from typing import List, Optional
from tqdm import tqdm


class GeminiEmbedder:
    """Generate embeddings using Google Gemini embedding-001 model."""

    def __init__(self, api_key: str, model_name: str = "gemini-embedding-001", cache_dir: str = "cache"):
        """
        Initialize the Gemini embedder.

        Args:
            api_key: Google Gemini API key
            model_name: Name of the embedding model
            cache_dir: Directory to store cached embeddings
        """
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name
        self.embedding_dimension = 768
        self.cache_dir = cache_dir

        # Create cache directory if it doesn't exist
        if not os.path.exists(cache_dir):
            os.makedirs(cache_dir)
            print(f"Created cache directory: {cache_dir}")

        print(f"Initialized Gemini embedder with model: {model_name}")
    
    def embed_text_batch(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for a batch of texts.
        """
        results = self.client.models.embed_content(
            model=self.model_name,
            contents=texts,
            config=types.EmbedContentConfig(task_type="CLUSTERING")
        )
        embeddings = np.array([np.array(emb.values) for emb in results.embeddings])

        # Validate shape immediately
        expected_shape = (len(texts), self.embedding_dimension)
        assert embeddings.shape == expected_shape, f"Expected shape {expected_shape}, got {embeddings.shape}"

        return embeddings

    def save_embeddings(self, embeddings: np.ndarray, cache_file: str):
        """Save embeddings to a pickle file."""
        cache_path = os.path.join(self.cache_dir, cache_file)
        with open(cache_path, 'wb') as f:
            pickle.dump(embeddings, f)
        print(f"Saved embeddings to {cache_path}")

    def load_embeddings(self, cache_file: str) -> Optional[np.ndarray]:
        """Load embeddings from a pickle file if it exists."""
        cache_path = os.path.join(self.cache_dir, cache_file)
        if os.path.exists(cache_path):
            with open(cache_path, 'rb') as f:
                embeddings = pickle.load(f)
            # Validate shape
            assert len(embeddings.shape) == 2, f"Loaded embeddings have wrong dimensions: {embeddings.shape}"
            assert embeddings.shape[1] == self.embedding_dimension, f"Loaded embeddings have wrong dimension: {embeddings.shape[1]}, expected {self.embedding_dimension}"
            print(f"Loaded embeddings from {cache_path} with shape: {embeddings.shape}")
            return embeddings
        return None

    def embed_batch(self, texts: List[str], batch_size: int = 100, cache_file: Optional[str] = None) -> np.ndarray:
        """
        Generate embeddings for a batch of texts with rate limiting.

        Args:
            texts: List of texts to embed
            batch_size: Number of texts to process at once
            cache_file: Optional filename to cache embeddings (e.g., "embeddings.pkl")

        Returns:
            Array of embeddings (n_texts, embedding_dim)
        """
        # Try to load from cache if cache_file is provided
        if cache_file:
            cached_embeddings = self.load_embeddings(cache_file)
            if cached_embeddings is not None:
                # Validate cached embeddings match input size
                assert cached_embeddings.shape[0] == len(texts), f"Cached embeddings size {cached_embeddings.shape[0]} doesn't match input size {len(texts)}"
                return cached_embeddings

        embeddings = []
        batch_cache_prefix = cache_file.replace('.pkl', '') if cache_file else 'embeddings'

        print(f"Generating embeddings for {len(texts)} texts...")

        for i in tqdm(range(0, len(texts), batch_size)):
            batch = texts[i:i + batch_size]
            batch_num = i // batch_size
            batch_cache_file = f"{batch_cache_prefix}_batch_{batch_num}.pkl"

            # Check if this batch was already processed
            cached_batch = self.load_embeddings(batch_cache_file)
            if cached_batch is not None:
                # Validate batch size matches
                assert cached_batch.shape[0] == len(batch), f"Cached batch size {cached_batch.shape[0]} doesn't match current batch size {len(batch)}"
                embeddings.append(cached_batch)
                continue

            try:
                print("Embedding batch number: ", batch_num)
                embedding = self.embed_text_batch(batch)
                print("Successfully embedded batch number: ", batch_num, " with shape: ", embedding.shape)

                # Save this batch immediately
                self.save_embeddings(embedding, batch_cache_file)
                embeddings.append(embedding)

                # Small delay to avoid rate limiting
                time.sleep(0.5) # 1 minute
            except Exception as e:
                print(f"Error embedding batch number: {batch_num}... Error: {e}. Falling back to zero vector.")
                # Use zero vector as fallback
                fallback_embeddings = np.zeros((len(batch), self.embedding_dimension))
                self.save_embeddings(fallback_embeddings, batch_cache_file)
                embeddings.append(fallback_embeddings)

        # Concatenate all batches into single array
        embeddings_array = np.vstack(embeddings)
        print(f"Generated embeddings with shape: {embeddings_array.shape}")

        # Validate final shape
        expected_shape = (len(texts), self.embedding_dimension)
        assert embeddings_array.shape == expected_shape, f"Final embeddings shape {embeddings_array.shape} doesn't match expected {expected_shape}"

        # Save final combined embeddings to cache if cache_file is provided
        if cache_file:
            self.save_embeddings(embeddings_array, cache_file)

        return embeddings_array

    def get_embedding_dimension(self) -> int:
        """Get the dimension of embeddings from this model."""
        # Gemini embedding-001 produces 768-dimensional embeddings
        return self.embedding_dimension
