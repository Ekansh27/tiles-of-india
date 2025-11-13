"""Clustering utilities for word categorization."""
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import normalize
from typing import Tuple, List


class WordClusterer:
    """Cluster word embeddings to discover categories."""

    def __init__(self, n_clusters: int = 10, random_state: int = 42, normalize_embeddings: bool = True):
        """
        Initialize the clusterer.

        Args:
            n_clusters: Number of clusters to create
            random_state: Random seed for reproducibility
            normalize_embeddings: Whether to normalize embeddings (for cosine similarity)
        """
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.normalize_embeddings = normalize_embeddings
        self.model = None
        self.labels = None
        self.centroids = None
        self.normalized_embeddings = None

    def fit(self, embeddings: np.ndarray) -> np.ndarray:
        """
        Fit K-Means clustering on embeddings.

        Args:
            embeddings: Array of embeddings (n_samples, n_features)

        Returns:
            Cluster labels for each embedding
        """
        print(f"Clustering {len(embeddings)} embeddings into {self.n_clusters} clusters...")

        # Normalize embeddings if enabled (for cosine similarity)
        if self.normalize_embeddings:
            print("Normalizing embeddings for cosine similarity...")
            self.normalized_embeddings = normalize(embeddings, norm='l2')
            clustering_embeddings = self.normalized_embeddings
        else:
            clustering_embeddings = embeddings

        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=self.random_state,
            n_init=10,
            max_iter=300
        )

        self.labels = self.model.fit_predict(clustering_embeddings)
        self.centroids = self.model.cluster_centers_

        # Calculate silhouette score
        silhouette = silhouette_score(clustering_embeddings, self.labels)
        print(f"Silhouette score: {silhouette:.3f}")

        # Print cluster sizes
        unique, counts = np.unique(self.labels, return_counts=True)
        print("\nCluster sizes:")
        for cluster_id, count in zip(unique, counts):
            print(f"  Cluster {cluster_id}: {count} words")

        return self.labels

    def get_representative_indices(self, embeddings: np.ndarray, n_representatives: int = 5) -> dict:
        """
        Get indices of words closest to each cluster centroid.

        Args:
            embeddings: Array of embeddings
            n_representatives: Number of representative words per cluster

        Returns:
            Dictionary mapping cluster_id to list of word indices
        """
        if self.centroids is None:
            raise ValueError("Must fit the model first")

        # Use normalized embeddings if normalization was enabled
        if self.normalize_embeddings and self.normalized_embeddings is not None:
            embeddings_to_use = self.normalized_embeddings
        else:
            embeddings_to_use = embeddings

        representatives = {}

        for cluster_id in range(self.n_clusters):
            # Get all embeddings in this cluster
            cluster_mask = self.labels == cluster_id
            cluster_embeddings = embeddings_to_use[cluster_mask]
            cluster_indices = np.where(cluster_mask)[0]

            # Calculate distances to centroid
            distances = np.linalg.norm(
                cluster_embeddings - self.centroids[cluster_id],
                axis=1
            )

            # Get indices of closest words
            closest_indices = np.argsort(distances)[:n_representatives]
            representatives[cluster_id] = cluster_indices[closest_indices].tolist()

        return representatives

    def evaluate_multiple_k(self, embeddings: np.ndarray, k_range: range) -> List[Tuple[int, float, float]]:
        """
        Evaluate clustering with different k values.

        Args:
            embeddings: Array of embeddings
            k_range: Range of k values to try

        Returns:
            List of (k, silhouette_score, inertia) tuples
        """
        # Normalize embeddings if enabled
        if self.normalize_embeddings:
            print("Normalizing embeddings for evaluation...")
            embeddings = normalize(embeddings, norm='l2')

        results = []

        print("Evaluating multiple k values...")
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=self.random_state, n_init=10)
            labels = kmeans.fit_predict(embeddings)
            silhouette = silhouette_score(embeddings, labels)
            inertia = kmeans.inertia_

            results.append((k, silhouette, inertia))
            print(f"  k={k}: silhouette={silhouette:.3f}, inertia={inertia:.2f}")

        return results
