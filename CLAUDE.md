# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VocabCards** is a single-file Thai English vocabulary learning app for middle and high school students (ม.ต้น–ม.ปลาย). The entire application (HTML, CSS, JavaScript) lives in `index.html` (~750+ lines).

**Key features:**
- 74 built-in vocabulary words across 5 categories: General Words, Phrasal Verbs, Idioms, Verb Forms
- Card flip animation with swipe gestures to mark words as "known" or "not known"
- Custom vocabulary import (manual entry, paste text, CSV file)
- Test history tracking with word-level granularity
- Mobile-optimized responsive design with Thai locale support

## Architecture

### Data Model
- **ALL array** (lines ~350–471): Base vocabulary objects with structure: `{en, ph, th, ex, exth, lv, cat}` where:
  - `en` = English word/phrase
  - `ph` = IPA pronunciation (empty for phrasal verbs, idioms)
  - `th` = Thai definition
  - `ex` = English example sentence
  - `exth` = Thai example
  - `lv` = difficulty level (ม.1–ม.6)
  - `cat` = category name (one of BASE_CATS or custom)

- **BASE_CATS** (line 474): Fixed category list: `["ทั้งหมด","คำศัพท์ทั่วไป","Phrasal Verbs","Idioms","Verb Forms"]`

- **localStorage**: Two keys persist user data:
  - `customVocab`: JSON array of user-added words (same object structure as ALL)
  - `testHistory`: JSON array of session objects: `{date (ISO), cat, total, known: [], notKnown: []}`
    - Max 30 sessions stored; oldest discarded when exceeded
    - `known` and `notKnown` are arrays of `{en, th}` objects for word-level tracking

### State Machine
- **Game state**: `activeCat`, `deck`, `idx`, `known`, `notKnown`, `flipped`, `done`
- **Session tracking**: `sessionKnown`, `sessionNotKnown` — track individual words during a test; saved to testHistory on completion
- **Touch state**: `tx0, ty0, dragging, didMove` — track swipe gestures; H_THR = 72px (horizontal threshold)

### Core Functions
- **loadCustom() / saveCustom()**: Read/write custom vocab from localStorage
- **getAllWords() / filtered()**: Merge built-in + custom vocab; filter by active category
- **getCats()**: Return BASE_CATS + any unique categories from custom vocab
- **shuffleAll()**: Create new `deck` from filtered words, reset counters, reset session arrays
- **render()**: Update card display, progress bar, stats; call showDone() when idx >= deck.length
- **mark(k)**: Record known (k=true) or not-known word; push to session array; increment counters; render next card
- **showDone()**: Save session to testHistory; show final results screen
- **flip()**: Toggle card face visibility; only shows result buttons when flipped

### Swipe Gesture Logic
- **Guard**: Swipe only works after card is flipped (`if (!flipped) return;` in touchmove/touchend)
- **Threshold**: 72px horizontal movement to trigger swipe
- **Direction**: Left (negative dx) = "not known"; Right (positive dx) = "known"
- **Animation**: Visual feedback with opacity labels during drag; card rotates based on dx
- **Detection**: Uses `touchstart` to capture baseline (tx0, ty0); `touchmove` to update transform; `touchend` to trigger mark() or reset

### UI System: Modal Tabs
- **TAB_IDS**: `['manual','paste','file','manage','history']`
- **switchTab(name)**: Toggles `.tab-panel` visibility and `.modal-tab` button active state; updates modal title
- **Each tab** has a dedicated panel in the HTML with `id="tab-{name}"`
- **History tab** calls `refreshHistory()` when opened; shows all test sessions with word lists

## Common Tasks

### Add a New Vocabulary Category
1. Add category name to BASE_CATS (line 474)
2. Add words to ALL array with matching `cat` value
3. buildCats() auto-discovers and renders category buttons

### Add Custom Vocabulary
Users import via modal tabs:
- **Manual**: Form inputs for en, th, ex, exth, lv, and **category dropdown** (shows BASE_CATS + any custom categories)
- **Paste**: Parse plain text (Tab-separated or newline-delimited)
- **File**: CSV import with header detection
- All three create objects with the same structure and allow category selection

### Test History
- Automatically captured when user completes a test (all cards reviewed)
- Displays in History tab with: date/time (Thai locale), category badge, known/not-known counts, word lists
- Clear button removes all history
- Max 30 sessions; older ones auto-discard

### Modify Card Styling
- Card dimensions: 250px height (line 52)
- Font sizes: English = 2.1rem (line 57); Thai = 1.6rem (line 61)
- Colors use CSS variables (--tx, --bg, --tx-info, etc.) defined in :root (lines 13–20)
- Flip animation: cubic-bezier(.4,0,.2,1) with 450ms duration

### Test the App
- Open `index.html` in a browser
- Chrome DevTools → Application tab to inspect/clear localStorage for testing
- Test on mobile device or use browser DevTools device emulation for touch events
- Use `/compact` to save context if conversation gets long

## Mobile-First Design
- Breakpoint: 600px (cards stack on mobile, expand on desktop)
- Safe viewport: `maximum-scale=1.0, user-scalable=no` to prevent accidental zoom
- Touch events use `{ passive: false }` for preventDefault() on swipe
- Font: Sarabun (Thai-friendly, loaded from Google Fonts)

## Recent Changes
- **Swipe behavior**: Must flip card first before swiping is enabled (`!flipped` guard in touchmove/touchend)
- **History tracking**: Records which specific words were marked known vs. not known, not just totals
- **Up-swipe removed**: Only left/right swipes trigger mark(); no skip gesture
- **Category support**: All three import methods now include a category dropdown
