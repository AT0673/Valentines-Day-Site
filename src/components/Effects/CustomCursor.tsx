import { useEffect, useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { theme } from '../../styles/theme';

const CursorDot = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  pointer-events: none;
  z-index: 10000;
  mix-blend-mode: difference;
  will-change: transform;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const CursorRing = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  opacity: 0.5;
  will-change: transform;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Trail = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 16px;
  will-change: transform, opacity;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

interface TrailItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '🌸', '✨', '💫'];

export default function CustomCursor() {
  const [trails, setTrails] = useState<TrailItem[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use refs to avoid re-renders
  const lastTrailTime = useRef(0);
  const trailThrottle = 150; // ms between trails

  // Use motion values for better performance (doesn't trigger re-renders)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Update cursor position using motion values (no re-render)
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);

    // Throttle trail creation
    const now = Date.now();
    if (now - lastTrailTime.current > trailThrottle && Math.random() > 0.92) {
      lastTrailTime.current = now;

      const newTrail: TrailItem = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      };

      setTrails(prev => {
        // Limit max trails to prevent memory issues
        const updated = [...prev, newTrail];
        return updated.length > 10 ? updated.slice(-10) : updated;
      });

      // Remove trail after animation
      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== newTrail.id));
      }, 1500);
    }
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const shouldHover =
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      !!target.closest('button') ||
      !!target.closest('a');

    setIsHovering(shouldHover);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add event listeners with passive flag for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile, handleMouseMove, handleMouseOver]);

  if (isMobile) return null;

  return (
    <>
      <CursorDot
        style={{
          x: cursorX,
          y: cursorY,
          translateX: -6,
          translateY: -6,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        }}
      />

      <CursorRing
        style={{
          x: cursorX,
          y: cursorY,
          translateX: -20,
          translateY: -20,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 200,
            damping: 15,
          },
        }}
      />

      <AnimatePresence mode="popLayout">
        {trails.map(trail => (
          <Trail
            key={trail.id}
            initial={{
              x: trail.x,
              y: trail.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: trail.x + (Math.random() - 0.5) * 50,
              y: trail.y - 50,
              scale: 1,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
            }}
          >
            {trail.emoji}
          </Trail>
        ))}
      </AnimatePresence>
    </>
  );
}
