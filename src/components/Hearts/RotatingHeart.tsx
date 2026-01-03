import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const HeartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing['4xl']} 0;
  perspective: 1000px;
`;

const HeartWrapper = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 200px;
    height: 200px;
  }
`;

const GlassHeart = styled(motion.svg)`
  filter: drop-shadow(0 16px 48px rgba(255, 107, 157, 0.3));
`;

export default function RotatingHeart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse follow
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
    stiffness: 100,
    damping: 30,
  });

  // Auto-rotation
  const [autoRotation, setAutoRotation] = useState(0);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setAutoRotation((prev) => (prev + 1) % 360);
      }, 30); // ~60fps

      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <HeartContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <HeartWrapper
        style={{
          rotateY: isHovering ? rotateY : autoRotation,
          rotateX: isHovering ? rotateX : 0,
        }}
        animate={{
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <GlassHeart
          width="250"
          height="250"
          viewBox="0 0 250 250"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glass morphism gradient */}
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(255, 107, 157, 0.2)" />
              <stop offset="100%" stopColor="rgba(200, 182, 226, 0.3)" />
            </linearGradient>

            {/* Inner glow */}
            <radialGradient id="innerGlow">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 107, 157, 0.1)" />
            </radialGradient>

            {/* Blur for glass effect */}
            <filter id="blur">
              <feGaussianBlur stdDeviation="1" />
            </filter>

            {/* Glass reflection */}
            <linearGradient id="reflection" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>

          {/* Main heart shape */}
          <motion.path
            d="M125,220 C125,220 40,165 40,105 C40,70 60,45 90,45 C102,45 114,50 125,62 C136,50 148,45 160,45 C190,45 210,70 210,105 C210,165 125,220 125,220 Z"
            fill="url(#glassGradient)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            animate={{
              fill: isHovering
                ? ['url(#glassGradient)', 'url(#innerGlow)', 'url(#glassGradient)']
                : 'url(#glassGradient)',
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          {/* Inner glow layer */}
          <motion.path
            d="M125,210 C125,210 50,160 50,110 C50,80 68,58 93,58 C103,58 113,62 125,72 C137,62 147,58 157,58 C182,58 200,80 200,110 C200,160 125,210 125,210 Z"
            fill="url(#innerGlow)"
            opacity="0.5"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Glass reflection highlight */}
          <ellipse
            cx="100"
            cy="80"
            rx="40"
            ry="30"
            fill="url(#reflection)"
            opacity="0.6"
            transform="rotate(-20 100 80)"
          />
        </GlassHeart>
      </HeartWrapper>
    </HeartContainer>
  );
}
