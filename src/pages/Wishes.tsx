import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useState, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const WishesContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.peachyBlush};
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};
  position: relative;
  z-index: 2;
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

const WishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const WishCard = styled(motion.div)`
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.soft};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '✨';
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const WishEmoji = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
`;

const WishText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.loose};
`;

const ShootingStar = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
  }
`;

const ClickPrompt = styled(motion.div)`
  text-align: center;
  margin-top: ${theme.spacing['2xl']};
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: ${theme.colors.secondary};
  position: relative;
  z-index: 2;
`;

const defaultWishes = [
  {
    emoji: '💫',
    text: 'May every day bring us closer and fill our hearts with even more love.'
  },
  {
    emoji: '🌟',
    text: 'I wish for countless adventures together, exploring the world hand in hand.'
  },
  {
    emoji: '💖',
    text: 'May we always find reasons to laugh, even on the toughest days.'
  },
  {
    emoji: '✨',
    text: 'I wish for us to grow old together, creating memories that last a lifetime.'
  },
  {
    emoji: '🌈',
    text: 'May our love continue to be a source of strength and inspiration for both of us.'
  },
  {
    emoji: '💝',
    text: 'I wish for you to always feel as cherished and loved as you make me feel.'
  }
];

interface Star {
  id: number;
  startX: number;
  startY: number;
}

export default function Wishes() {
  const { content: pageContent } = usePageContent('wishes');
  const [stars, setStars] = useState<Star[]>([]);
  const [wishes, setWishes] = useState(defaultWishes);
  const [title, setTitle] = useState('Wishes Upon Stars');
  const [subtitle, setSubtitle] = useState('Every wish is for us');

  useEffect(() => {
    if (pageContent) {
      if (pageContent.title) setTitle(pageContent.title);
      if (pageContent.subtitle) setSubtitle(pageContent.subtitle);
      if (pageContent.wishes && Array.isArray(pageContent.wishes)) {
        setWishes(pageContent.wishes);
      }
    }
  }, [pageContent]);

  const createShootingStar = () => {
    const newStar: Star = {
      id: Date.now(),
      startX: Math.random() * window.innerWidth,
      startY: Math.random() * 300
    };

    setStars(prev => [...prev, newStar]);

    setTimeout(() => {
      setStars(prev => prev.filter(star => star.id !== newStar.id));
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleWishClick = () => {
    createShootingStar();
  };

  return (
    <WishesContainer onClick={handleWishClick}>
      {stars.map(star => (
        <ShootingStar
          key={star.id}
          initial={{
            x: star.startX,
            y: star.startY,
            opacity: 1
          }}
          animate={{
            x: star.startX + 400,
            y: star.startY + 400,
            opacity: 0
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut'
          }}
        />
      ))}

      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </Subtitle>
      </Header>

      <WishesGrid>
        {wishes.map((wish, index) => (
          <WishCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.05 }}
            onClick={createShootingStar}
          >
            <WishEmoji>{wish.emoji}</WishEmoji>
            <WishText>{wish.text}</WishText>
          </WishCard>
        ))}
      </WishesGrid>

      <ClickPrompt
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        Click anywhere to make a wish ✨
      </ClickPrompt>
    </WishesContainer>
  );
}
