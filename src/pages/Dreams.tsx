import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useState } from 'react';
import { useDreams } from '../hooks/useDreams';

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

const fallbackDreams = [
  {
    icon: '🏖️',
    title: 'Visit Cornwall',
    description: 'Would it not be amazing to explore the beach and walk the sand dunes and horrify the poor villages of Cornwall together? (i didn\'t forget) ',
  },
  {
    icon: '🏡',
    title: 'A House with Cats and Dogs',
    description: 'A beautiful cottage surrounded by trees and strawberries, and like a bazillion cats and dogs running around us. (we need a mainecoon and a Kingsley)',
  },
  {
    icon: '💎',
    title: 'Matching Jewelry',
    description: 'I want like matching rings or necklaces or something cute that we can wear to show everyone that we\'re together forever. (I may be a little possessive, im sorry)',
  },
  {
    icon: '✈️',
    title: 'Complete the China Trip',
    description: 'I\'m so excited to finally go to China with you and meet the family, and go surfing, and eat all the sushi, and go karaoke until my throat is dead. (I\'m so sorry for being a shit singer..)',
  },
  {
    icon: '🏛️',
    title: 'Explore York',
    description: 'This is SO close now.. I can\'t believe we didn\'t get valentines week off.. but I\'m so excited to finally go there and eat loads of sushi and do devious things..',
  },
  {
    icon: '🎙️',
    title: 'Become a Twitch Streamer',
    description: 'On EVERYONES soul we WILL become streamers together. We shall become the next speed and kai cenat and get loads of simps to donate all thier savings to us',
  },
];

export default function Dreams() {
  const { dreams: firebaseDreams, loading } = useDreams();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Use Firebase dreams if available, otherwise use fallback
  const displayDreams = firebaseDreams.length > 0 ? firebaseDreams : fallbackDreams;

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

  if (loading) {
    return (
      <DreamsContainer>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Loading...
          </Title>
        </Header>
      </DreamsContainer>
    );
  }

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
        {displayDreams.map((dream, index) => (
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
