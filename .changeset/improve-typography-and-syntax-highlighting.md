---
"@jsonblog/generator-boilerplate": minor
---

Improve typography and add automatic syntax highlighting

Major improvements to reading experience inspired by Medium.com:

**Typography Enhancements:**
- Increased base font size from 16px to 19px (20% larger) for better readability
- Improved line-height from 1.6 to 1.75 for better breathing room
- Increased max-width from 680px to 816px (20% wider)
- Changed to system fonts for body text for native feel across devices
- Improved heading hierarchy with larger sizes and better spacing
- Better paragraph and list spacing throughout

**Syntax Highlighting:**
- Added Highlight.js for automatic syntax highlighting
- Supports 190+ languages with auto-detection
- Atom One Dark theme for professional code appearance
- Dark code blocks with improved padding and border-radius

**List & Code Improvements:**
- Fixed ordered/unordered list indentation
- Improved spacing between list items and nested lists
- Better inline code styling with distinct backgrounds
- Enhanced blockquotes, tables, and other elements

**Visual Updates:**
- Updated link colors to #0066cc for better contrast
- Improved responsive breakpoints
- Better table styling with zebra striping
- Enhanced overall visual hierarchy

Breaking change: Body font changed from IBM Plex Mono to system fonts. IBM Plex Mono is now used only for code blocks.
