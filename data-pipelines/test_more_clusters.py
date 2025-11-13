"""Test clustering with higher k values to find optimal clusters."""
import numpy as np
from utils.clusterer import WordClusterer
import matplotlib.pyplot as plt

# Load embeddings
embeddings = np.load('cache/embeddings.npy')
print(f"Loaded embeddings shape: {embeddings.shape}")

# Test k from 2 to 50
clusterer = WordClusterer(n_clusters=10, random_state=42, normalize_embeddings=True)
results = clusterer.evaluate_multiple_k(embeddings, range(2, 51))

# Extract results
k_values = [r[0] for r in results]
silhouette_scores = [r[1] for r in results]
inertias = [r[2] for r in results]

# Find best k
best_k = max(results, key=lambda x: x[1])
print(f"\n{'='*60}")
print(f"Best k={best_k[0]} with silhouette={best_k[1]:.4f}")
print(f"{'='*60}")

# Show top 5 k values by silhouette score
sorted_results = sorted(results, key=lambda x: x[1], reverse=True)
print("\nTop 5 k values by silhouette score:")
for i, (k, sil, inertia) in enumerate(sorted_results[:5], 1):
    print(f"  {i}. k={k}: silhouette={sil:.4f}, inertia={inertia:.2f}")

# Plot elbow curve
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(k_values, silhouette_scores, 'bo-')
ax1.axvline(best_k[0], color='r', linestyle='--', label=f'Best k={best_k[0]}')
ax1.set_xlabel('Number of Clusters (k)')
ax1.set_ylabel('Silhouette Score')
ax1.set_title('Silhouette Score vs Number of Clusters')
ax1.grid(True, alpha=0.3)
ax1.legend()

ax2.plot(k_values, inertias, 'go-')
ax2.set_xlabel('Number of Clusters (k)')
ax2.set_ylabel('Inertia')
ax2.set_title('Elbow Method: Inertia vs Number of Clusters')
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('cache/cluster_evaluation.png', dpi=150)
print("\nPlot saved to cache/cluster_evaluation.png")
