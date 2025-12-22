#!/usr/bin/env python3
"""
Find non-Hindi anagrams for each Hindi word.
This script identifies valid Scrabble words that are anagrams of Hindi words
but are not themselves Hindi words.
"""

from collections import defaultdict
import json


def get_sorted_key(word):
    """Get the sorted letter signature of a word."""
    return ''.join(sorted(word.upper()))


def parse_indian_words(filepath):
    """Parse indian_words.txt and return dict of word -> definition."""
    indian_words = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 2:
                word = parts[0].strip().upper()
                definition = parts[1].strip()
                indian_words[word] = definition
    return indian_words


def parse_all_words(filepath):
    """Parse all_words.txt and return dict of word -> definition."""
    all_words = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 2:
                word = parts[0].strip().upper()
                definition = parts[1].strip()
                all_words[word] = definition
    return all_words


def find_anagram_groups(words_dict):
    """Group words by their anagram signature."""
    anagram_groups = defaultdict(list)
    for word in words_dict.keys():
        key = get_sorted_key(word)
        anagram_groups[key].append(word)
    return anagram_groups


def main():
    print("Loading words...")

    # Load both word lists
    indian_words = parse_indian_words('../public/indian_words.txt')
    all_words = parse_all_words('../public/all_words.txt')

    print(f"Loaded {len(indian_words)} Indian words")
    print(f"Loaded {len(all_words)} total Scrabble words")

    # Find anagram groups for all words
    all_anagrams = find_anagram_groups(all_words)

    # Find all cases where Hindi word has non-Hindi anagrams
    results = []

    for hindi_word, hindi_def in indian_words.items():
        anagram_key = get_sorted_key(hindi_word)
        anagram_group = all_anagrams.get(anagram_key, [])

        # Find non-Hindi words in this anagram group
        non_hindi_anagrams = [
            word for word in anagram_group
            if word not in indian_words and word != hindi_word
        ]

        # Include if there's at least one non-Hindi anagram
        if len(non_hindi_anagrams) >= 1:
            # Sort non-Hindi anagrams alphabetically
            non_hindi_anagrams.sort()

            # Create list of non-Hindi anagram objects
            non_hindi_list = [
                {
                    'word': word,
                    'definition': all_words[word]
                }
                for word in non_hindi_anagrams
            ]

            results.append({
                'hindi_word': hindi_word,
                'hindi_definition': hindi_def,
                'non_hindi_anagrams': non_hindi_list,
                'total_anagrams_in_scrabble': len(anagram_group)
            })

    # Sort by Hindi word
    results.sort(key=lambda x: x['hindi_word'])

    # Save to JSON
    output_file = 'non_hindi_anagrams.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Done!")
    print(f"📝 Found {len(results)} Hindi words with non-Hindi anagrams")
    print(f"📄 Saved to: {output_file}")

    # Show some examples
    print(f"\n📊 Examples:")
    for item in results[:10]:
        print(f"   {item['hindi_word']} ({item['hindi_definition'][:50]}...)")
        for anagram in item['non_hindi_anagrams']:
            print(f"      → {anagram['word']} ({anagram['definition'][:50]}...)")
        print()


if __name__ == '__main__':
    main()
