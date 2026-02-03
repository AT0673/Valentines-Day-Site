import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useWishes } from '../hooks/useWishes';

// ── Styled Components ──────────────────────────────────────────────

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
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  pointer-events: none;
`;

const BackgroundStar = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.8);
`;

const HintText = styled(motion.div)`
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${theme.typography.fonts.script};
  font-size: 22px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  z-index: 1;
  pointer-events: none;
`;

const WishStarButton = styled(motion.div)`
  position: absolute;
  font-size: 24px;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba(244, 228, 193, 0.6));
  z-index: 3;
  user-select: none;
  transform: translate(-50%, -50%);

  &:hover {
    filter: drop-shadow(0 0 16px rgba(244, 228, 193, 0.9));
  }
`;

const ExpandedWishContainer = styled(motion.div)`
  position: absolute;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
`;

const ExpandedStar = styled(motion.div)`
  font-size: 72px;
  cursor: pointer;
  filter: drop-shadow(0 0 20px rgba(244, 228, 193, 0.9));
  user-select: none;
`;

const WishTextBubble = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: #f4e4c1;
  text-shadow: 0 0 10px rgba(244, 228, 193, 0.5);
  text-align: center;
  max-width: 250px;
  margin-top: 8px;
  pointer-events: none;
`;

const ShootingStarTrail = styled(motion.div)`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #f4e4c1;
  border-radius: 50%;
  box-shadow: 0 0 12px 4px rgba(244, 228, 193, 0.8);
  z-index: 10;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg,
      rgba(244, 228, 193, 0) 0%,
      rgba(244, 228, 193, 0.8) 100%
    );
    transform: translateY(-50%);
  }
`;

const WishInput = styled(motion.input)`
  position: absolute;
  z-index: 10;
  background: transparent;
  border: 1px solid rgba(244, 228, 193, 0.6);
  border-radius: 8px;
  padding: 8px 16px;
  color: #f4e4c1;
  font-family: ${theme.typography.fonts.script};
  font-size: 18px;
  text-align: center;
  outline: none;
  width: 200px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(244, 228, 193, 0.3);

  &::placeholder {
    color: rgba(244, 228, 193, 0.4);
  }
`;

// ── Helpers ────────────────────────────────────────────────────────

interface BgStar {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface ShootingStar {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface InputState {
  x: number;
  y: number;
}

function generateBackgroundStars(count: number): BgStar[] {
  const stars: BgStar[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    });
  }
  return stars;
}

function nudgePosition(
  x: number,
  y: number,
  existing: { x: number; y: number }[],
  minDist: number = 5
): { x: number; y: number } {
  const isClear = (px: number, py: number) =>
    existing.every(
      (p) => Math.hypot(p.x - px, p.y - py) >= minDist
    );

  if (isClear(x, y)) return { x, y };

  // Spiral outward
  for (let r = minDist; r < 50; r += 2) {
    for (let angle = 0; angle < 360; angle += 30) {
      const nx = x + r * Math.cos((angle * Math.PI) / 180);
      const ny = y + r * Math.sin((angle * Math.PI) / 180);
      const cx = Math.max(2, Math.min(98, nx));
      const cy = Math.max(2, Math.min(98, ny));
      if (isClear(cx, cy)) return { x: cx, y: cy };
    }
  }

  return { x, y };
}

// ── Component ──────────────────────────────────────────────────────

export default function Wishes() {
  const { wishes, loading, addWish } = useWishes();
  const [expandedWishId, setExpandedWishId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [shootingStar, setShootingStar] = useState<ShootingStar | null>(null);
  const [inputState, setInputState] = useState<InputState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bgStars = useMemo(() => generateBackgroundStars(120), []);

  // Auto-hide hint after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleSkyClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't act if clicking a star, input, or expanded area
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-wish-star]') ||
        target.closest('input') ||
        target.closest('[data-expanded]')
      ) {
        return;
      }

      // If something is expanded, collapse it
      if (expandedWishId) {
        setExpandedWishId(null);
        return;
      }

      // If input is showing, dismiss it
      if (inputState) {
        setInputState(null);
        return;
      }

      // Hide hint on first click
      setShowHint(false);

      const rect = containerRef.current!.getBoundingClientRect();
      let xPct = ((e.clientX - rect.left) / rect.width) * 100;
      let yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // Nudge if too close to existing
      const existingPositions = wishes.map((w) => ({
        x: w.position.x,
        y: w.position.y,
      }));
      const nudged = nudgePosition(xPct, yPct, existingPositions);
      xPct = nudged.x;
      yPct = nudged.y;

      // Launch shooting star from random top-left area to click position
      const fromX = Math.random() * 20;
      const fromY = Math.random() * 20;
      const star: ShootingStar = {
        id: Date.now(),
        fromX,
        fromY,
        toX: xPct,
        toY: yPct,
      };
      setShootingStar(star);

      // After animation, show input
      setTimeout(() => {
        setShootingStar(null);
        setInputState({ x: xPct, y: yPct });
        // Focus after render
        setTimeout(() => inputRef.current?.focus(), 50);
      }, 900);
    },
    [expandedWishId, inputState, wishes]
  );

  const handleInputSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const text = (e.target as HTMLInputElement).value.trim();
        if (text && inputState) {
          addWish(text, { x: inputState.x, y: inputState.y });
        }
        setInputState(null);
      } else if (e.key === 'Escape') {
        setInputState(null);
      }
    },
    [inputState, addWish]
  );

  const handleInputBlur = useCallback(() => {
    setInputState(null);
  }, []);

  const handleStarClick = useCallback(
    (e: React.MouseEvent, wishId: string) => {
      e.stopPropagation();
      setExpandedWishId((prev) => (prev === wishId ? null : wishId));
    },
    []
  );

  if (loading) return null;

  return (
    <SkyContainer ref={containerRef} onClick={handleSkyClick}>
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
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

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

      {/* Wish stars */}
      {wishes.map((wish) => {
        const isExpanded = expandedWishId === wish.id;

        if (isExpanded) {
          return (
            <ExpandedWishContainer
              key={wish.id}
              data-expanded
              style={{
                left: `${wish.position.x}%`,
                top: `${wish.position.y}%`,
              }}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
            >
              <ExpandedStar
                data-wish-star
                onClick={(e: React.MouseEvent) => handleStarClick(e, wish.id)}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌟
              </ExpandedStar>
              <WishTextBubble
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {wish.text}
              </WishTextBubble>
            </ExpandedWishContainer>
          );
        }

        return (
          <WishStarButton
            key={wish.id}
            data-wish-star
            style={{
              left: `${wish.position.x}%`,
              top: `${wish.position.y}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            whileHover={{ scale: 1.3 }}
            onClick={(e: React.MouseEvent) => handleStarClick(e, wish.id)}
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
              left: `${shootingStar.fromX}%`,
              top: `${shootingStar.fromY}%`,
              opacity: 1,
            }}
            animate={{
              left: `${shootingStar.toX}%`,
              top: `${shootingStar.toY}%`,
              opacity: [1, 1, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Wish input */}
      <AnimatePresence>
        {inputState && (
          <WishInput
            ref={inputRef}
            key="wish-input"
            placeholder="Make a wish..."
            style={{
              left: `${inputState.x}%`,
              top: `${inputState.y}%`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onKeyDown={handleInputSubmit}
            onBlur={handleInputBlur}
          />
        )}
      </AnimatePresence>

      {/* Hint text */}
      <AnimatePresence>
        {showHint && (
          <HintText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tap the sky to make a wish
          </HintText>
        )}
      </AnimatePresence>
    </SkyContainer>
  );
}
