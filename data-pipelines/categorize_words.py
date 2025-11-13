"""
Main pipeline script for categorizing Indian words using embeddings and clustering.

This script:
1. Parses indian_words.txt
2. Generates embeddings using Gemini embedding-001
3. Clusters words using K-Means
4. Reduces dimensions with UMAP for visualization
5. Generates category names using Gemini
6. Exports to JSON format
"""

import os
import json
import numpy as np
import config
from utils.parser import parse_indian_words_file, create_embedding_text
from utils.embedder import GeminiEmbedder
from utils.clusterer import WordClusterer
from utils.visualizer import EmbeddingVisualizer
from utils.exporter import CategoryExporter


def load_or_generate_embeddings(words, embedder, cache_file, use_cache=True):
    """Load embeddings from cache or generate new ones."""
    if use_cache and os.path.exists(cache_file):
        print(f"\nLoading embeddings from cache: {cache_file}")
        embeddings = np.load(cache_file)
        print(f"Loaded embeddings with shape: {embeddings.shape}")
        return embeddings

    print("\nGenerating new embeddings...")
    texts = [create_embedding_text(word) for word in words]
    embeddings = embedder.embed_batch(texts, batch_size=config.BATCH_SIZE)

    # Cache embeddings
    os.makedirs(config.CACHE_DIR, exist_ok=True)
    np.save(cache_file, embeddings)
    print(f"Cached embeddings to: {cache_file}")

    # Also cache the words data
    words_cache = os.path.join(config.CACHE_DIR, "words.json")
    with open(words_cache, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    return embeddings


def main():
    """Run the complete word categorization pipeline."""
    print("=" * 60)
    print("Word Categorization Pipeline")
    print("=" * 60)

    # Check API key
    if not config.GEMINI_API_KEY:
        print("\nERROR: GEMINI_API_KEY not found in environment!")
        print("Please create a .env file with your API key:")
        print("  GEMINI_API_KEY=your_api_key_here")
        return

    # Step 1: Parse input file
    print("\n[1/7] Parsing input file...")
    words = parse_indian_words_file(config.INPUT_FILE)

    if not words:
        print("ERROR: No words parsed from input file!")
        return

    # Step 2: Generate embeddings
    print("\n[2/7] Generating embeddings...")
    embedder = GeminiEmbedder(
        api_key=config.GEMINI_API_KEY,
        model_name=config.EMBEDDING_MODEL
    )
    embeddings = load_or_generate_embeddings(
        words,
        embedder,
        config.EMBEDDINGS_CACHE,
        use_cache=config.USE_CACHE
    )

    # Step 3: Find optimal number of clusters
    print("\n[3/8] Finding optimal number of clusters...")
    clusterer = WordClusterer(
        n_clusters=config.NUM_CLUSTERS,
        random_state=config.RANDOM_SEED,
        normalize_embeddings=True  # Use cosine similarity
    )

    # Evaluate different k values to find optimal clusters
    k_results = clusterer.evaluate_multiple_k(embeddings, range(2, 21))

    # Find k with best silhouette score
    best_k = max(k_results, key=lambda x: x[1])
    print(f"\nBest k={best_k[0]} with silhouette={best_k[1]:.3f}")

    # Update clusterer with optimal k
    clusterer.n_clusters = best_k[0]

    # Step 4: Cluster embeddings with optimal k
    print(f"\n[4/8] Clustering embeddings with k={best_k[0]}...")
    labels = clusterer.fit(embeddings)

    # Step 5: Get representative words
    print("\n[5/8] Finding representative words...")
    representative_indices = clusterer.get_representative_indices(embeddings, n_representatives=10)

    # Step 6: Reduce dimensions for visualization
    print("\n[6/8] Reducing dimensions for visualization...")
    visualizer = EmbeddingVisualizer(
        n_components=2,
        random_state=config.RANDOM_SEED
    )
    coords_2d = visualizer.fit_transform(embeddings)
    coords_2d_normalized = visualizer.normalize_coordinates(coords_2d)

    # Step 7: Generate category names
    print("\n[7/8] Generating category names...")
    category_names, category_descriptions = CategoryExporter.generate_category_names_with_gemini(
        words,
        labels,
        representative_indices,
        config.GEMINI_API_KEY,
        best_k[0]  # Use optimal k instead of config.NUM_CLUSTERS
    )

    # Step 8: Export to JSON
    print("\n[8/8] Exporting to JSON...")
    metadata = {
        "embedding_model": config.EMBEDDING_MODEL,
        "clustering_algorithm": "kmeans",
        "silhouette_score": 0.0  # Will be calculated in clusterer
    }

    output_data = CategoryExporter.create_output_json(
        words,
        labels,
        coords_2d_normalized,
        category_names,
        category_descriptions,
        representative_indices,
        metadata
    )

    CategoryExporter.export_to_json(output_data, config.OUTPUT_FILE)

    print("\n" + "=" * 60)
    print("Pipeline completed successfully!")
    print("=" * 60)
    print(f"\nOutput file: {config.OUTPUT_FILE}")
    print(f"Total words categorized: {len(words)}")
    print(f"Number of categories: {best_k[0]}")
    print(f"Best silhouette score: {best_k[1]:.3f}")


if __name__ == "__main__":
    main()
