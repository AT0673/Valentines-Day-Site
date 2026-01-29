import { motion, AnimatePresence, type Variants } from 'framer-motion';
import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
}

type CustomVariants = Record<string, any>;

const TransitionWrapper = styled.div`
  position: relative;
`;

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const Particle = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.8) 0%, rgba(200, 182, 226, 0.4) 100%);
  box-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
`;

const HeartParticle = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  font-size: 16px;
  opacity: 0.8;
`;

interface ParticleData {
  id: number;
  x: number;
  y: number;
  type: 'circle' | 'heart';
  emoji?: string;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const particleVariants: CustomVariants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: (custom: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    x: [0, (Math.random() - 0.5) * 200],
    y: [0, -150 - Math.random() * 100],
    transition: {
      duration: 1.2,
      delay: custom * 0.02,
      ease: 'easeOut',
    },
  }),
};

const heartVariants: CustomVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    rotate: 0,
  },
  animate: (custom: number) => ({
    scale: [0, 1, 0.8, 0],
    opacity: [0, 1, 0.8, 0],
    y: [0, -200],
    rotate: [0, 360],
    transition: {
      duration: 2,
      delay: custom * 0.03,
      ease: 'easeOut',
    },
  }),
};

export default function PageTransition({ children, location }: PageTransitionProps) {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    // Generate particles on route change
    const newParticles: ParticleData[] = [];
    const particleCount = 30;
    const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '🌸'];

    for (let i = 0; i < particleCount; i++) {
      const isHeart = Math.random() > 0.6;
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: isHeart ? 'heart' : 'circle',
        emoji: isHeart ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)] : undefined,
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <TransitionWrapper>
      <AnimatePresence mode="wait">
        {particles.length > 0 && (
          <ParticleContainer key="particles">
            {particles.map((particle, index) => {
              if (particle.type === 'heart') {
                return (
                  <HeartParticle
                    key={particle.id}
                    x={particle.x}
                    y={particle.y}
                    custom={index}
                    variants={heartVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {particle.emoji}
                  </HeartParticle>
                );
              }

              return (
                <Particle
                  key={particle.id}
                  x={particle.x}
                  y={particle.y}
                  custom={index}
                  variants={particleVariants}
                  initial="initial"
                  animate="animate"
                />
              );
            })}
          </ParticleContainer>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TransitionWrapper>
  );
}
