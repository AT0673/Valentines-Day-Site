# Wishes Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the card-based wishes page with a full-screen interactive starry sky where users click to add wishes that become star emojis, and click stars to reveal wishes.

**Architecture:** Single-page React component rewrite. Firestore `wishes` collection for persistence. Framer Motion for all animations. Percentage-based positioning for cross-device consistency.

**Tech Stack:** React 19, TypeScript, Emotion (styled), Framer Motion, Firebase Firestore

---

### Task 1: Create useWishes hook for Firestore CRUD

**Files:**
- Create: `src/hooks/useWishes.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import type { Wish } from '../types/firestore';

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishData: Wish[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        position: doc.data().position,
      }));
      setWishes(wishData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addWish = async (text: string, position: { x: number; y: number }) => {
    if (!db || !isFirebaseConfigured) return null;

    const docRef = await addDoc(collection(db, 'wishes'), {
      text,
      position,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  };

  return { wishes, loading, addWish };
}
```

**Step 2: Verify it compiles**

Run: `cd /home/user/Valentines-Day-Site && npx tsc --noEmit src/hooks/useWishes.ts 2>&1 || true`

If type errors, fix them.

**Step 3: Commit**

```bash
git add src/hooks/useWishes.ts
git commit -m "feat(wishes): add useWishes hook for Firestore CRUD"
```

---

### Task 2: Rewrite Wishes component — canvas and background stars

Replace the entire `src/pages/Wishes.tsx` with the new starry sky canvas. This task sets up the container, background stars, hint text, and the data layer. No interactivity yet.

**Files:**
- Modify: `src/pages/Wishes.tsx` (full rewrite)

**Step 1: Rewrite the component**

Replace the entire file with:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useWishes } from '../hooks/useWishes';

// ── Styled Components ──────────────────────────────────────────

const SkyContainer = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg,
    #0a0e27 0%,
    #1a1133 30%,
    #2d1b4e 60%,
    #4a2c5e 100%
  );
  overflow: hidden;
  cursor: crosshair;
`;

const Dimmer = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  pointer-events: none;
`;

const BackgroundStar = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.8);
  z-index: 1;
  pointer-events: none;
`;

const HintText = styled(motion.div)`
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${theme.typography.fonts.script};
  font-size: 22px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  z-index: 5;
  pointer-events: none;
`;

const WishStarButton = styled(motion.div)`
  position: absolute;
  font-size: 28px;
  cursor: pointer;
  z-index: 3;
  user-select: none;
  filter: drop-shadow(0 0 8px rgba(255, 223, 100, 0.6));
  transform: translate(-50%, -50%);
`;

const ExpandedWishContainer = styled(motion.div)`
  position: absolute;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
`;

const ExpandedStar = styled(motion.div)`
  font-size: 72px;
  filter: drop-shadow(0 0 20px rgba(255, 223, 100, 0.9));
  cursor: pointer;
  user-select: none;
`;

const WishTextBubble = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: #f4e4c1;
  text-shadow: 0 0 12px rgba(244, 228, 193, 0.6);
  text-align: center;
  max-width: 260px;
  margin-top: 8px;
  line-height: 1.4;
`;

const ShootingStarTrail = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #f4e4c1;
  border-radius: 50%;
  box-shadow: 0 0 12px 3px rgba(244, 228, 193, 0.9);
  z-index: 10;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg,
      rgba(244, 228, 193, 0) 0%,
      rgba(244, 228, 193, 0.8) 100%
    );
    transform-origin: right center;
  }
`;

const WishInput = styled(motion.input)`
  position: absolute;
  z-index: 11;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 223, 100, 0.4);
  border-radius: 20px;
  padding: 10px 16px;
  color: #f4e4c1;
  font-family: ${theme.typography.fonts.script};
  font-size: 18px;
  outline: none;
  width: 240px;
  text-align: center;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 223, 100, 0.2);

  &::placeholder {
    color: rgba(244, 228, 193, 0.5);
  }
`;

// ── Types ──────────────────────────────────────────────────────

interface BgStar {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface ActiveShootingStar {
  id: number;
  targetX: number;
  targetY: number;
}

// ── Helpers ────────────────────────────────────────────────────

const NUDGE_RADIUS = 5; // percentage

function nudgePosition(
  x: number,
  y: number,
  existing: { x: number; y: number }[]
): { x: number; y: number } {
  const tooClose = existing.some(
    (p) => Math.hypot(p.x - x, p.y - y) < NUDGE_RADIUS
  );
  if (!tooClose) return { x, y };

  // Try positions in a spiral outward
  for (let r = NUDGE_RADIUS; r < NUDGE_RADIUS * 4; r += 2) {
    for (let angle = 0; angle < 360; angle += 45) {
      const nx = x + r * Math.cos((angle * Math.PI) / 180);
      const ny = y + r * Math.sin((angle * Math.PI) / 180);
      const clamped = {
        x: Math.max(5, Math.min(95, nx)),
        y: Math.max(5, Math.min(95, ny)),
      };
      const ok = existing.every(
        (p) => Math.hypot(p.x - clamped.x, p.y - clamped.y) >= NUDGE_RADIUS
      );
      if (ok) return clamped;
    }
  }
  return { x, y }; // fallback
}

// ── Component ──────────────────────────────────────────────────

export default function Wishes() {
  const { wishes, addWish } = useWishes();
  const [bgStars, setBgStars] = useState<BgStar[]>([]);
  const [expandedWishId, setExpandedWishId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [shootingStar, setShootingStar] = useState<ActiveShootingStar | null>(null);
  const [inputPos, setInputPos] = useState<{ x: number; y: number } | null>(null);

  // Generate background stars once
  useEffect(() => {
    const stars: BgStar[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
    }));
    setBgStars(stars);
  }, []);

  // Auto-hide hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkyClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't act if clicking on a star or input
      if ((e.target as HTMLElement).closest('[data-wish-star]') || inputPos) return;

      // Collapse any expanded wish
      if (expandedWishId) {
        setExpandedWishId(null);
        return;
      }

      setHintVisible(false);

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      const existingPositions = wishes.map((w) => w.position);
      const finalPos = nudgePosition(xPct, yPct, existingPositions);

      // Launch shooting star toward target
      const startX = Math.random() * 30;
      const startY = Math.random() * 20;
      const starId = Date.now();

      setShootingStar({ id: starId, targetX: finalPos.x, targetY: finalPos.y });

      // After shooting star lands, show input
      setTimeout(() => {
        setShootingStar(null);
        setInputPos(finalPos);
      }, 900);
    },
    [wishes, expandedWishId, inputPos]
  );

  const handleInputSubmit = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputPos) {
        const text = (e.target as HTMLInputElement).value.trim();
        if (text) {
          await addWish(text, inputPos);
        }
        setInputPos(null);
      }
      if (e.key === 'Escape') {
        setInputPos(null);
      }
    },
    [inputPos, addWish]
  );

  const handleStarClick = useCallback(
    (wishId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedWishId((prev) => (prev === wishId ? null : wishId));
    },
    []
  );

  return (
    <SkyContainer onClick={handleSkyClick}>
      {/* Dimmer overlay when a wish is expanded */}
      <AnimatePresence>
        {expandedWishId && (
          <Dimmer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Background twinkling stars */}
      {bgStars.map((star) => (
        <BackgroundStar
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Hint text */}
      <AnimatePresence>
        {hintVisible && (
          <HintText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            Tap the sky to make a wish
          </HintText>
        )}
      </AnimatePresence>

      {/* Wish stars */}
      {wishes.map((wish) => {
        const isExpanded = expandedWishId === wish.id;
        if (isExpanded) {
          return (
            <ExpandedWishContainer
              key={wish.id}
              style={{ left: `${wish.position.x}%`, top: `${wish.position.y}%` }}
              data-wish-star
            >
              <ExpandedStar
                initial={{ scale: 1, fontSize: '28px' }}
                animate={{ scale: 1, fontSize: '72px' }}
                exit={{ scale: 1, fontSize: '28px' }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={(e) => handleStarClick(wish.id, e)}
              >
                🌟
              </ExpandedStar>
              <WishTextBubble
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {wish.text}
              </WishTextBubble>
            </ExpandedWishContainer>
          );
        }

        return (
          <WishStarButton
            key={wish.id}
            style={{ left: `${wish.position.x}%`, top: `${wish.position.y}%` }}
            whileHover={{ scale: 1.3 }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            onClick={(e) => handleStarClick(wish.id, e)}
            data-wish-star
          >
            🌟
          </WishStarButton>
        );
      })}

      {/* Shooting star animation */}
      <AnimatePresence>
        {shootingStar && (
          <ShootingStarTrail
            key={shootingStar.id}
            initial={{
              left: `${Math.random() * 30}%`,
              top: `${Math.random() * 20}%`,
              opacity: 1,
            }}
            animate={{
              left: `${shootingStar.targetX}%`,
              top: `${shootingStar.targetY}%`,
              opacity: [1, 1, 0.6],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      {/* Wish input */}
      <AnimatePresence>
        {inputPos && (
          <WishInput
            key="wish-input"
            style={{ left: `${inputPos.x}%`, top: `${inputPos.y}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            placeholder="Make a wish..."
            autoFocus
            onKeyDown={handleInputSubmit}
            onBlur={() => setInputPos(null)}
            maxLength={150}
          />
        )}
      </AnimatePresence>
    </SkyContainer>
  );
}
```

**Step 2: Verify the build compiles**

Run: `cd /home/user/Valentines-Day-Site && npx vite build 2>&1 | tail -20`

Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/pages/Wishes.tsx
git commit -m "feat(wishes): rewrite wishes page as interactive starry sky"
```

---

### Task 3: Manual smoke test and polish

**Step 1: Start dev server and visually verify**

Run: `cd /home/user/Valentines-Day-Site && npx vite --host 2>&1 &`

Open `/wishes` and verify:
- Full-screen starry sky renders
- Background stars twinkle
- Hint text appears and fades
- Clicking sky triggers shooting star then input
- Typing wish and pressing Enter creates a star
- Clicking star expands it with wish text
- Clicking elsewhere collapses it
- Sky dims when wish is expanded

**Step 2: Fix any visual or interaction issues found**

**Step 3: Final commit and push**

```bash
git push -u origin claude/test-uploaded-skills-v2SVh
```
