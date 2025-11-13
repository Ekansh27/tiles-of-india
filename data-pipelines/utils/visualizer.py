"""Dimensionality reduction and visualization utilities."""
import numpy as np
from umap import UMAP
from typing import Tuple


class EmbeddingVisualizer:
    """Reduce embeddings to 2D for visualization."""

    def __init__(self, n_components: int = 2, random_state: int = 42):
        """
        Initialize the visualizer.

        Args:
            n_components: Number of dimensions to reduce to (2 or 3)
            random_state: Random seed for reproducibility
        """
        self.n_components = n_components
        self.random_state = random_state
        self.reducer = None

    def fit_transform(self, embeddings: np.ndarray) -> np.ndarray:
        """
        Reduce embeddings to 2D/3D using UMAP.

        Args:
            embeddings: High-dimensional embeddings (n_samples, n_features)

        Returns:
            Reduced embeddings (n_samples, n_components)
        """
        print(f"Reducing {embeddings.shape[1]}D embeddings to {self.n_components}D using UMAP...")

        self.reducer = UMAP(
            n_components=self.n_components,
            n_neighbors=15,
            min_dist=0.1,
            metric='cosine',
            random_state=self.random_state
        )

        reduced = self.reducer.fit_transform(embeddings)
        print(f"Reduced embeddings shape: {reduced.shape}")

        return reduced

    def normalize_coordinates(self, coords: np.ndarray) -> np.ndarray:
        """
        Normalize coordinates to [0, 1] range for easier visualization.

        Args:
            coords: Coordinates to normalize

        Returns:
            Normalized coordinates
        """
        min_vals = coords.min(axis=0)
        max_vals = coords.max(axis=0)
        normalized = (coords - min_vals) / (max_vals - min_vals)
        return normalized
