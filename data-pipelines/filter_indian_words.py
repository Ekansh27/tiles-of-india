#!/usr/bin/env python3
"""
Indian/South Asian Scrabble Words Filter
Edit the SEARCH_PATTERNS list below to add/remove filtering criteria
"""

import re
import sys

# ============================================
# CONFIGURATION - Edit these patterns freely!
# ============================================

SEARCH_PATTERNS = [
    # Indian subcontinent languages
    r'\(Hindi',
    r'\(Urdu',
    r'\(Sanskrit',
    r'\(Punjabi',
    r'\(Bengali',
    r'\(Tamil',
    r'\(Telugu',
    r'\(Marathi',
    r'\(Gujarati',
    
    # Geographic references
    r'Indian ',
    r'\(India',
    r'in India',
    r'of India',
    r'from India',
    r'Pakistani',
    r'\(Pakistan',
    r'in Pakistan',
    r'South Asia',
    r'in South Asia',
    
    # Religious/cultural terms
    r'Hindu',
    r'Buddhism',
    r'Buddhist',
    r'Sikh',
    r'Jain',
    
    # Other relevant terms (add more as needed)
    # r'Himalayan',
    # r'Kashmiri',
]

# ============================================
# Script logic (don't need to edit below)
# ============================================

def should_include(definition):
    """Check if definition matches any search pattern"""
    for pattern in SEARCH_PATTERNS:
        if re.search(pattern, definition, re.IGNORECASE):
            return True
    return False

def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'csw24.tsv'
    output_file = 'indian_words.txt'
    wordlist_file = 'indian_words_wordlist.txt'
    
    print(f"Reading from: {input_file}")
    print(f"Using {len(SEARCH_PATTERNS)} search patterns")
    
    matched_words = []
    unique_words = set()
    
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            parts = line.split('\t')
            if len(parts) < 2:
                continue
            
            word = parts[0].strip()
            definition = parts[1].strip()
            
            if should_include(definition):
                matched_words.append(f"{word}\t{definition}")
                unique_words.add(word)
    
    # Sort words
    matched_words.sort()
    unique_words = sorted(unique_words)
    
    # Write full list with definitions
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(matched_words))
    
    # Write just words
    with open(wordlist_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(unique_words))
    
    print(f"\n✅ Done!")
    print(f"📝 Found {len(unique_words)} unique words")
    print(f"📄 Saved to: {output_file}")
    print(f"📄 Word list: {wordlist_file}")
    
    # Show breakdown by length
    length_counts = {}
    for word in unique_words:
        length = len(word)
        length_counts[length] = length_counts.get(length, 0) + 1
    
    print(f"\n📊 Breakdown by length:")
    for length in sorted(length_counts.keys()):
        print(f"   {length} letters: {length_counts[length]} words")

if __name__ == '__main__':
    main()
