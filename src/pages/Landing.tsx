import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const LandingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradients.pinkLavender};
  z-index: ${theme.zIndex.modal};
  overflow: hidden;
`;

const HeartContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  user-select: none;
`;

const Heart = styled(motion.svg)`
  filter: drop-shadow(0 8px 24px rgba(255, 107, 157, 0.4));
`;

const ClickText = styled(motion.p)`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.primary};
  opacity: 0;
  white-space: nowrap;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  pointer-events: none;
`;

export default function Landing() {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Show "Click to enter" text after 5 seconds
    const textTimer = setTimeout(() => setShowText(true), 5000);

    // Auto-advance after 8 seconds if no interaction
    const autoAdvanceTimer = setTimeout(() => {
      if (!clicked) {
        handleHeartClick();
      }
    }, 8000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(autoAdvanceTimer);
    };
  }, [clicked]);

  const handleHeartClick = () => {
    if (clicked) return;
    setClicked(true);

    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
    }));
    setParticles(newParticles);

    // Navigate after animation completes
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <HeartContainer
        onClick={handleHeartClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          width="200"
          height="200"
          viewBox="0 0 200 200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            clicked
              ? {
                  scale: [1, 20],
                  opacity: [1, 0],
                }
              : {
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={
            clicked
              ? { duration: 2, ease: 'easeOut' }
              : {
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  },
                  opacity: { duration: 0.6 },
                }
          }
        >
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B9D" />
              <stop offset="100%" stopColor="#C8B6E2" />
            </linearGradient>
          </defs>
          <path
            d="M100,170 C100,170 30,120 30,80 C30,50 50,30 75,30 C85,30 95,35 100,45 C105,35 115,30 125,30 C150,30 170,50 170,80 C170,120 100,170 100,170 Z"
            fill="url(#heartGradient)"
          />
        </Heart>

        {/* Particles */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0.5,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}

        <ClickText
          animate={showText && !clicked ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Click to enter
        </ClickText>
      </HeartContainer>
    </LandingContainer>
  );
}
