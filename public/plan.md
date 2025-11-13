# Tiles of India - Visualization Plan

## Project Overview
A visualization component for exploring Indian-origin words in the official Scrabble dictionary. The goal is to create an **Interactive Category Explorer** with an **Exploratory** focus, allowing users to discover and browse words in an engaging way.

---

## Visualization Concept: Interactive Category Explorer

### Natural Categories Identified
From analyzing the word definitions in `indian_words.txt`, the following categories emerge naturally:

- **Food & Cuisine**: achar (pickle), aloo/alu (potato), amreeta (immortality drink)
- **Clothing & Textiles**: achkan (coat), almirah (wardrobe), ambari/ambary (fiber plant)
- **Philosophy & Spirituality**: aatman (essential self), ahimsa (nonviolence), adharma (unrighteousness), ajiva (inanimate matter)
- **Music & Arts**: alaap/alap/alapa (raga introduction), aarti (candle ceremony)
- **Nature & Flora**: aal (mulberry tree), agila (aloe wood), amla (tree)
- **People & Occupations**: acharya (teacher), aia (maid/nurse), amildar (revenue collector)
- **Animals & Birds**: amadavat/avadavat (finch)
- **Places & Structures**: akhara (gymnasium)

---

## Proposed User Interface Design

### 1. **Main View: Category Grid/Bubbles**
- Visual representation of all categories
- Each category displayed as a colored bubble or card
- Bubble size represents number of words in that category
- Click to drill into category details
- Hover effects to preview category

### 2. **Category Detail View**
- Shows all words within the selected category
- Words displayed as interactive tiles
- Organized by word length or alphabetically
- Hover over word to see definition preview
- Click word for full details
- **"Practice these words"** button to start filtered training session

### 3. **Word Detail Panel**
- Full definition and etymology
- Language origin highlighted (Hindi, Sanskrit, Urdu, Tamil, etc.)
- Scrabble point value calculation
- Related words in the same category
- Personal stats if the word has been practiced
- Link to start practice with this word

---

## Visual Design

### Color Palette
- Use India-themed colors (forest greens, oranges, whites)
- Current theme: Forest green (`#228B22`) as primary
- Indian flag gradient for special elements: orange → white → green

### Visual Effects
- Three.js background with subtle geometric patterns (existing forest green particles/cubes)
- Smooth transitions between views
- Glass morphism panels (already implemented)
- Jura font for modern, clean typography

### Layout Style
- Clean, minimalist design
- Focus on content discoverability
- Mobile-responsive
- Accessible and intuitive navigation

---

## Technical Implementation

### Data Structure Requirements

#### Current State
```
indian_words.txt format:
WORD    (Language) definition [lexical info]
```

#### Needed Enhancement
Add category metadata to words. Options:
1. **AI Auto-categorization**: Use AI to analyze definitions and add category tags (80-90% accurate, fastest)
2. **Manual + AI Hybrid**: AI suggests, human reviews (most accurate)
3. **Pattern Matching**: Use keyword patterns in definitions (simpler, less flexible)
4. **Start Small**: Manually categorize subset (~50-100 words) as proof of concept

Proposed new data format:
```typescript
interface Word {
  word: string
  definition: string
  length: number
  language: string  // Hindi, Sanskrit, Urdu, Tamil, etc.
  categories: string[]  // ['food', 'cuisine'], ['philosophy', 'spirituality']
  scrabblePoints?: number  // calculated or stored
}
```

### Application Architecture

#### New Components
- `CategoryExplorer.tsx` - Main visualization container
- `CategoryGrid.tsx` - Grid/bubble view of categories
- `CategoryDetail.tsx` - Detailed view of words in a category
- `WordDetailPanel.tsx` - Full word information panel
- `CategoryFilter.tsx` - Filter and search controls

#### Routing Options
- **Option A**: New `/explore` route (separate section accessible from landing/menu)
- **Option B**: Replace current menu with category browser
- **Option C**: Add as additional tab alongside length-based selection
- **Option D**: Feature prominently on landing page

#### State Management
- Extend existing `GameContext` or create new `ExplorationContext`
- Track:
  - Selected category
  - Filtered word list
  - User's exploration history
  - Integration with existing cardbox practice system

#### Data Integration
- Parse and categorize words on load
- Create category index for fast filtering
- Integrate with existing practice flow
- Allow starting practice sessions from any category

---

## User Flow

1. **Enter Visualization**
   - User clicks "Explore" from menu or landing page
   - Categories load with animated entrance

2. **Browse Categories**
   - User sees all categories as interactive elements
   - Hover to preview word count and examples
   - Click to dive into category

3. **Explore Words in Category**
   - View all words in selected category
   - Click individual words for full details
   - Option to start practice with these words

4. **Start Practice**
   - "Practice these words" button
   - Filter existing practice mode to selected category
   - Seamless integration with cardbox system

5. **Return to Exploration**
   - Easy navigation back to category view
   - Breadcrumb navigation
   - Smooth transitions

---

## Implementation Phases

### Phase 1: Data Preparation
- Choose categorization approach
- Categorize words (AI, manual, or hybrid)
- Update data structure
- Create category index

### Phase 2: Core Visualization
- Build CategoryGrid component with visual category representation
- Implement category selection and navigation
- Create CategoryDetail view with word lists
- Add smooth transitions

### Phase 3: Word Details
- Build WordDetailPanel component
- Show etymology, language origin, point values
- Display related words
- Add personal progress stats

### Phase 4: Practice Integration
- Connect visualization to existing practice system
- Enable filtered practice by category
- Integrate with cardbox progress tracking
- Add "Practice these words" functionality

### Phase 5: Polish & Enhancement
- Optimize performance
- Add search and filtering
- Enhance animations
- Mobile responsiveness testing
- Accessibility improvements

---

## Open Questions

1. **Data Categorization Method**: Which approach to use for adding categories?
2. **Navigation Placement**: Where should the visualization live in the app?
3. **Category Taxonomy**: Should we have subcategories? (e.g., Food > Vegetables, Spices)
4. **Visualization Type**: Grid, bubbles, or another layout for categories?
5. **Mobile Experience**: How to adapt the visualization for smaller screens?

---

## Success Metrics

- Increased user engagement with word exploration
- Higher retention and return visits
- More diverse practice sessions (not just by length)
- User feedback on discoverability
- Completion of practice sessions initiated from categories

---

## Future Enhancements

- **Multi-dimensional filtering**: Combine category + length + language origin
- **Word relationships**: Show etymology connections between words
- **Learning paths**: Curated journeys through related words
- **Community features**: User-contributed categories or collections
- **Statistics**: Compare your knowledge across categories
- **Gamification**: Badges for mastering categories
