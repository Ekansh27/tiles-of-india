"""Parser for indian_words.txt file."""
import re
from typing import List, Dict


def parse_word_entry(line: str) -> Dict[str, str]:
    """
    Parse a single line from indian_words.txt.

    Format: WORD\t(Language) definition [lexical info]

    Args:
        line: A line from the input file

    Returns:
        Dictionary with word, language, and definition
    """
    line = line.strip()
    if not line:
        return None

    # Split by tab to get word and rest
    parts = line.split('\t', 1)
    if len(parts) != 2:
        return None

    word = parts[0].strip()
    rest = parts[1].strip()

    # Extract language (in parentheses)
    language_match = re.match(r'\(([^)]+)\)', rest)
    language = language_match.group(1) if language_match else "Unknown"

    # Remove language part to get definition
    definition = re.sub(r'^\([^)]+\)\s*', '', rest)

    # Remove lexical info in square brackets at the end
    definition = re.sub(r'\s*\[.*?\]\s*$', '', definition)

    return {
        'word': word.lower(),
        'word_upper': word,
        'language': language,
        'definition': definition,
        'length': len(word)
    }


def parse_indian_words_file(filepath: str) -> List[Dict[str, str]]:
    """
    Parse the entire indian_words.txt file.

    Args:
        filepath: Path to indian_words.txt

    Returns:
        List of word dictionaries
    """
    words = []
    seen_words = set()

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            word_data = parse_word_entry(line)
            if word_data and word_data['word'] not in seen_words:
                words.append(word_data)
                seen_words.add(word_data['word'])

    print(f"Parsed {len(words)} unique words from {filepath}")
    return words


def create_embedding_text(word_data: Dict[str, str]) -> str:
    """
    Create the text to embed for a word.

    Args:
        word_data: Dictionary with word information

    Returns:
        Text string to embed
    """
    # Include word, language, and definition for richer semantic context
    # This helps the embedding model distinguish between different word types
    return f"{word_data['word_upper']} ({word_data['language']}): {word_data['definition']}"