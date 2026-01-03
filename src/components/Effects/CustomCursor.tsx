import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Trail = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 16px;

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<TrailItem[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create trail effect occasionally
      if (Math.random() > 0.85) {
        const newTrail: TrailItem = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        };

        setTrails(prev => [...prev, newTrail]);

        // Remove trail after animation
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== newTrail.id));
        }, 1500);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <CursorDot
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      <CursorRing
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
        }}
      />

      <AnimatePresence>
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
            }}
            transition={{
              duration: 1.5,
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
