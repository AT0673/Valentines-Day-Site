import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

const RippleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Ripple = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.primary};
  transform: translate(-50%, -50%);
`;

const SwipeTrail = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  font-size: 20px;
  transform: translate(-50%, -50%);
`;

interface RippleData {
  id: number;
  x: number;
  y: number;
}

interface TrailData {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const emojis = ['✨', '💫', '🌸', '💖', '💕', '🌟'];

export default function MobileTouchEffects() {
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const [trails, setTrails] = useState<TrailData[]>([]);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];

      // Create ripple
      const newRipple: RippleData = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);

      setLastTouch({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];

      if (lastTouch) {
        const distance = Math.sqrt(
          Math.pow(touch.clientX - lastTouch.x, 2) +
          Math.pow(touch.clientY - lastTouch.y, 2)
        );

        // Create trail particles when moving
        if (distance > 30) {
          const newTrail: TrailData = {
            id: Date.now() + Math.random(),
            x: touch.clientX,
            y: touch.clientY,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
          };

          setTrails(prev => [...prev, newTrail]);

          setTimeout(() => {
            setTrails(prev => prev.filter(t => t.id !== newTrail.id));
          }, 1000);

          setLastTouch({ x: touch.clientX, y: touch.clientY });
        }
      }
    };

    const handleTouchEnd = () => {
      setLastTouch(null);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, lastTouch]);

  if (!isMobile) return null;

  return (
    <RippleContainer>
      <AnimatePresence>
        {ripples.map(ripple => (
          <Ripple
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {trails.map(trail => (
          <SwipeTrail
            key={trail.id}
            x={trail.x}
            y={trail.y}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              y: trail.y - 40,
              scale: 1,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {trail.emoji}
          </SwipeTrail>
        ))}
      </AnimatePresence>
    </RippleContainer>
  );
}
