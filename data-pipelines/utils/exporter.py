"""Export categorized words to JSON format."""
import json
import numpy as np
from typing import List, Dict
from datetime import datetime


class CategoryExporter:
    """Export categorized words to JSON."""

    @staticmethod
    def create_output_json(
        words: List[Dict],
        labels: np.ndarray,
        coords_2d: np.ndarray,
        category_names: Dict[int, str],
        category_descriptions: Dict[int, str],
        representative_indices: Dict[int, List[int]],
        metadata: Dict
    ) -> Dict:
        """
        Create the final output JSON structure.

        Args:
            words: List of word dictionaries from parser
            labels: Cluster labels for each word
            coords_2d: 2D coordinates for visualization
            category_names: Mapping of cluster_id to category name
            category_descriptions: Mapping of cluster_id to description
            representative_indices: Mapping of cluster_id to representative word indices
            metadata: Additional metadata (model info, etc.)

        Returns:
            Complete output dictionary ready for JSON export
        """
        # Calculate category statistics
        categories = []
        for cluster_id in range(len(category_names)):
            cluster_words = [
                words[i] for i, label in enumerate(labels) if label == cluster_id
            ]
            rep_indices = representative_indices.get(cluster_id, [])
            rep_words = [words[i]['word'] for i in rep_indices[:5]]

            categories.append({
                "id": f"category-{cluster_id}",
                "name": category_names.get(cluster_id, f"Category {cluster_id}"),
                "description": category_descriptions.get(cluster_id, ""),
                "size": len(cluster_words),
                "representative_words": rep_words
            })

        # Create word entries with categories
        word_entries = []
        for i, word_data in enumerate(words):
            cluster_id = int(labels[i])
            category_id = f"category-{cluster_id}"

            word_entries.append({
                "word": word_data['word'],
                "wordUpper": word_data['word_upper'],
                "definition": word_data['definition'],
                "language": word_data['language'],
                "length": word_data['length'],
                "categories": [category_id],
                "cluster_id": cluster_id,
                "embedding_coords": {
                    "x": float(coords_2d[i, 0]),
                    "y": float(coords_2d[i, 1])
                }
            })

        # Create metadata
        output_metadata = {
            "total_words": len(words),
            "total_categories": len(categories),
            "embedding_model": metadata.get("embedding_model", "unknown"),
            "clustering_algorithm": metadata.get("clustering_algorithm", "kmeans"),
            "generated_at": datetime.now().isoformat(),
            "silhouette_score": metadata.get("silhouette_score", 0.0)
        }

        return {
            "metadata": output_metadata,
            "categories": categories,
            "words": word_entries
        }

    @staticmethod
    def export_to_json(output_data: Dict, filepath: str) -> None:
        """
        Export data to JSON file.

        Args:
            output_data: Dictionary to export
            filepath: Output file path
        """
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)

        print(f"\nExported categorized words to: {filepath}")
        print(f"Total words: {output_data['metadata']['total_words']}")
        print(f"Total categories: {output_data['metadata']['total_categories']}")

    @staticmethod
    def generate_category_names_with_gemini(
        words: List[Dict],
        labels: np.ndarray,
        representative_indices: Dict[int, List[int]],
        api_key: str,
        n_clusters: int
    ) -> tuple[Dict[int, str], Dict[int, str]]:
        """
        Use Gemini to generate category names and descriptions.

        Args:
            words: List of word dictionaries
            labels: Cluster labels
            representative_indices: Representative word indices per cluster
            api_key: Gemini API key
            n_clusters: Number of clusters

        Returns:
            Tuple of (category_names dict, category_descriptions dict)
        """
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        category_names = {}
        category_descriptions = {}

        print("\nGenerating category names using Gemini...")

        for cluster_id in range(n_clusters):
            # Get representative words for this cluster
            rep_indices = representative_indices.get(cluster_id, [])[:10]
            rep_words_data = [words[i] for i in rep_indices]

            # Create prompt
            words_list = "\n".join([
                f"- {w['word']}: {w['definition']}"
                for w in rep_words_data
            ])

            prompt = f"""Analyze these Indian-origin words from a Scrabble dictionary and suggest a concise category name (2-3 words max) and a brief description (1 sentence).

Words:
{words_list}

Respond in this exact format:
Category Name: [name]
Description: [description]"""

            try:
                response = model.generate_content(prompt)
                text = response.text

                # Parse response
                name_line = [l for l in text.split('\n') if 'Category Name:' in l]
                desc_line = [l for l in text.split('\n') if 'Description:' in l]

                if name_line and desc_line:
                    category_name = name_line[0].split('Category Name:')[1].strip()
                    category_desc = desc_line[0].split('Description:')[1].strip()
                else:
                    category_name = f"Category {cluster_id}"
                    category_desc = f"Words related to {rep_words_data[0]['word']}"

                category_names[cluster_id] = category_name
                category_descriptions[cluster_id] = category_desc

                print(f"  Cluster {cluster_id}: {category_name}")

            except Exception as e:
                print(f"  Error generating name for cluster {cluster_id}: {e}")
                category_names[cluster_id] = f"Category {cluster_id}"
                category_descriptions[cluster_id] = ""

        return category_names, category_descriptions
