# Wishes Page Redesign — Starry Sky Interactive Wishes

**Date:** 2026-02-03

## Overview

Redesign the wishes page from a card-based grid layout to a full-screen interactive starry sky. Users click the sky to add wishes that become star emojis. Clicking a star reveals the wish within it.

## The Canvas

- Full-screen starry night sky with no header, grid, or cards — just sky
- Existing cosmic gradient background retained
- Subtle twinkling background stars for atmosphere
- User-created wish-stars rendered as glowing star emojis positioned absolutely by percentage x/y coordinates
- On first visit, a gentle hint fades in at the bottom: "Tap the sky to make a wish" — fades out after a few seconds or first interaction

## Adding a Wish

1. User clicks/taps an empty area of the sky
2. A shooting star animates across the sky and lands at the click position (~1 second animation)
3. A small text input fades in at that spot — transparent background, soft glowing border, light text
4. User types their wish and presses Enter
5. The input fades out, a glowing star emoji fades in at that position
6. Wish saved to Firestore with text and x/y percentage coordinates

**Edge cases:**
- Click away or press Escape before submitting: input dismisses, nothing saved
- Click too close to an existing star (within ~5% radius): nudge new position to nearest open space

## Revealing a Wish

1. User clicks an existing star emoji
2. Star scales up (~3x) with intensifying glow effect
3. Wish text fades in beneath the enlarged star — delicate font (Dancing Script) with text-shadow glow
4. Rest of the sky dims slightly to focus attention
5. Click elsewhere or the star again to collapse: text fades out, star shrinks back, sky brightens

**Constraints:**
- Only one wish expanded at a time
- Clicking a different star collapses the current one and expands the new one

## Data Model

Uses the existing `Wish` type from `src/types/firestore.ts`:

```typescript
interface Wish {
  id: string;
  text: string;
  createdAt: Date;
  position: {
    x: number; // percentage of viewport width
    y: number; // percentage of viewport height
  };
}
```

Stored in a dedicated `wishes` Firestore collection (not embedded in `pages` document).

## Technical Approach

- **Framework:** React + TypeScript (existing stack)
- **Animations:** Framer Motion for all animations (shooting star, input fade, star expand/collapse, sky dim)
- **Positioning:** Absolute positioning using percentage-based x/y for cross-device consistency
- **Data fetching:** Fetch all wishes on mount, render as positioned emojis
- **Performance:** Lightweight — just positioned emojis, no pagination needed. Could limit to most recent ~100 if ever necessary.
- **Admin:** No admin changes needed — wishes are self-managing through user interaction

## What's NOT Included (YAGNI)

- No authentication or user identity
- No ability to delete wishes from the UI
- No categories, tags, or filtering
- No pagination or infinite scroll
- No constellation/clustering logic
