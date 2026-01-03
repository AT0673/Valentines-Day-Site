import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useState } from 'react';

const DreamsContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.peachyBlush};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};
`;

const Title = styled(motion.h1)`
  font-family: ${theme.typography.fonts.display};
  font-size: 56px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 36px;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 24px;
  color: ${theme.colors.secondary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const DreamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing['2xl']};
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const DreamBubble = styled(motion.div)`
  background: ${theme.colors.glass.light};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.soft};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 107, 157, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const DreamIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const DreamTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h3};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
`;

const DreamDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.loose};
  text-align: center;
`;

const FloatingParticle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.6) 0%, transparent 70%);
  pointer-events: none;
`;

const dreams = [
  {
    icon: '🏖️',
    title: 'Travel the World',
    description: 'Explore beautiful places together, from tropical beaches to snowy mountains, creating memories in every corner of the globe.',
  },
  {
    icon: '🏡',
    title: 'Build Our Home',
    description: 'Create a warm, loving space that reflects us—filled with laughter, comfort, and all our favorite things.',
  },
  {
    icon: '🎓',
    title: 'Grow Together',
    description: 'Support each other through every challenge and achievement, becoming the best versions of ourselves side by side.',
  },
  {
    icon: '🌟',
    title: 'Chase Our Passions',
    description: 'Encourage each other to pursue our dreams, celebrate our successes, and turn our wildest ideas into reality.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Start a Family',
    description: 'Build a family filled with love, laughter, and endless adventures, passing on our values and creating new traditions.',
  },
  {
    icon: '💫',
    title: 'Create Magic Daily',
    description: 'Find joy in the little moments, surprise each other with kindness, and never stop making ordinary days extraordinary.',
  },
];

export default function Dreams() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = { id: Date.now(), x, y };
    setParticles(prev => [...prev, newParticle]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <DreamsContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Dreams Together
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Building our future, one dream at a time
        </Subtitle>
      </Header>

      <DreamsGrid>
        {dreams.map((dream, index) => (
          <DreamBubble
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -12, scale: 1.05 }}
            onMouseMove={handleHover}
          >
            {particles.map(particle => (
              <FloatingParticle
                key={particle.id}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: particle.x + (Math.random() - 0.5) * 100,
                  y: particle.y - 100,
                  scale: 1,
                  opacity: 0
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            ))}

            <DreamIcon>{dream.icon}</DreamIcon>
            <DreamTitle>{dream.title}</DreamTitle>
            <DreamDescription>{dream.description}</DreamDescription>
          </DreamBubble>
        ))}
      </DreamsGrid>
    </DreamsContainer>
  );
}
