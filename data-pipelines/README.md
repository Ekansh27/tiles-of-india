# Word Categorization Pipeline

This pipeline automatically categorizes Indian-origin words from the Scrabble dictionary using semantic embeddings and clustering.

## Overview

The pipeline performs the following steps:
1. **Parse** `indian_words.txt` to extract words, definitions, and language origins
2. **Generate embeddings** using Google Gemini's embedding-001 model
3. **Cluster** words using K-Means to discover natural categories
4. **Visualize** clusters by reducing dimensions to 2D using UMAP
5. **Name categories** automatically using Gemini AI
6. **Export** categorized words to JSON format

## Setup

### 1. Create Virtual Environment

```bash
cd data-pipelines
uv venv
```

Activate the environment:
- Windows: `.venv\Scripts\activate`
- Unix/Mac: `source .venv/bin/activate`

### 2. Install Dependencies

```bash
uv pip install -r requirements.txt
```

### 3. Configure API Key

Create a `.env` file in the `data-pipelines` directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://ai.google.dev/

## Usage

### Run the Pipeline

```bash
cd data-pipelines
.venv/Scripts/python categorize_words.py
```

Or on Unix/Mac:
```bash
cd data-pipelines
.venv/bin/python categorize_words.py
```

### Configuration

Edit `config.py` to adjust:
- `NUM_CLUSTERS`: Number of categories to create (default: 10)
- `BATCH_SIZE`: Batch size for API requests (default: 100)
- `USE_CACHE`: Whether to cache embeddings (default: True)

### Output

The pipeline generates `public/categorized_words.json` with this structure:

```json
{
  "metadata": {
    "total_words": 450,
    "total_categories": 10,
    "embedding_model": "models/embedding-001",
    "clustering_algorithm": "kmeans",
    "generated_at": "2025-11-09T...",
    "silhouette_score": 0.42
  },
  "categories": [
    {
      "id": "category-0",
      "name": "Food & Cuisine",
      "description": "Words related to Indian food and cooking",
      "size": 45,
      "representative_words": ["achar", "aloo", "amreeta"]
    }
  ],
  "words": [
    {
      "word": "achar",
      "wordUpper": "ACHAR",
      "definition": "a spicy pickle made primarily from mango...",
      "language": "Hindi",
      "length": 5,
      "categories": ["category-0"],
      "cluster_id": 0,
      "embedding_coords": {"x": 0.42, "y": 0.15}
    }
  ]
}
```

## Caching

Embeddings are cached in `cache/embeddings.npy` to avoid regenerating them on subsequent runs. To regenerate:
- Delete the cache file, or
- Set `USE_CACHE = False` in `config.py`

## Cost Estimate

Using Gemini API:
- **Embeddings**: ~450 words × 20 tokens/word × $0.00001/token ≈ $0.09
- **Category naming**: ~10 categories × $0.01 ≈ $0.10
- **Total**: ~$0.19 per run

## Project Structure

```
data-pipelines/
├── categorize_words.py      # Main pipeline script
├── config.py                 # Configuration
├── requirements.txt          # Dependencies
├── .env                      # API keys (create this)
├── utils/
│   ├── parser.py            # Parse indian_words.txt
│   ├── embedder.py          # Gemini embeddings
│   ├── clusterer.py         # K-Means clustering
│   ├── visualizer.py        # UMAP visualization
│   └── exporter.py          # JSON export
├── cache/
│   └── embeddings.npy       # Cached embeddings
└── output/
    └── (temporary files)
```

## Troubleshooting

### API Key Error
```
ERROR: GEMINI_API_KEY not found in environment!
```
**Solution**: Create a `.env` file with your Gemini API key.

### Rate Limiting
If you encounter rate limiting errors, adjust the `time.sleep()` value in `utils/embedder.py` or reduce `BATCH_SIZE` in `config.py`.

### Poor Clustering Results
Try adjusting `NUM_CLUSTERS` in `config.py`. You can also experiment with different k values by modifying the clusterer code.

## Next Steps

After running the pipeline:
1. Review the generated categories in `categorized_words.json`
2. Manually refine category names if needed
3. Integrate the JSON output with the frontend visualization
4. Iterate on `NUM_CLUSTERS` if categorization isn't optimal

## Technical Details

- **Embedding Model**: Gemini embedding-001 (768 dimensions)
- **Clustering**: K-Means with 10 clusters
- **Dimensionality Reduction**: UMAP for 2D visualization
- **Category Naming**: Gemini Pro for automatic naming
