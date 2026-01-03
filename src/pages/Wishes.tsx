import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useState, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const WishesContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: linear-gradient(180deg,
    #0a0e27 0%,
    #1a1133 30%,
    #2d1b4e 60%,
    #4a2c5e 100%
  );
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
  color: #f4e4c1;
  margin-bottom: ${theme.spacing.md};
  text-shadow: 0 0 20px rgba(244, 228, 193, 0.5);

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 36px;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 24px;
  color: #d4b5f7;
  text-shadow: 0 0 10px rgba(212, 181, 247, 0.3);

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const WishesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['2xl']};
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const WishCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(244, 228, 193, 0.1) 0%, rgba(212, 181, 247, 0.1) 100%);
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
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
`;

const WishText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: rgba(255, 255, 255, 0.9);
  line-height: ${theme.typography.lineHeights.loose};
  position: relative;
  z-index: 1;
`;

const Star = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.8);
  z-index: 1;
`;

const ShootingStar = styled(motion.div)`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #f4e4c1;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(244, 228, 193, 0.8);
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg,
      rgba(244, 228, 193, 0) 0%,
      rgba(244, 228, 193, 0.8) 50%,
      rgba(244, 228, 193, 0) 100%
    );
    transform: translateX(-100%);
  }
`;

const WishingStar = styled(motion.div)`
  position: absolute;
  font-size: 40px;
  cursor: pointer;
  filter: drop-shadow(0 0 10px rgba(244, 228, 193, 0.6));
  z-index: 5;
  user-select: none;
`;

const ClickPrompt = styled(motion.div)`
  text-align: center;
  margin-top: ${theme.spacing['3xl']};
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 2;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
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

interface BackgroundStar {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
}

interface WishingStarType {
  id: number;
  x: number;
  y: number;
}

export default function Wishes() {
  const { content: pageContent } = usePageContent('wishes');
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [backgroundStars, setBackgroundStars] = useState<BackgroundStar[]>([]);
  const [wishingStars, setWishingStars] = useState<WishingStarType[]>([]);
  const [wishes, setWishes] = useState(defaultWishes);
  const [title, setTitle] = useState('Wish Upon a Star');
  const [subtitle, setSubtitle] = useState('Click anywhere in the sky to make a wish together');

  // Generate background stars
  useEffect(() => {
    const stars: BackgroundStar[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3
      });
    }
    setBackgroundStars(stars);

    // Generate wishing stars
    const wishes: WishingStarType[] = [
      { id: 1, x: 50, y: 15 },
      { id: 2, x: 80, y: 35 },
      { id: 3, x: 40, y: 70 },
    ];
    setWishingStars(wishes);
  }, []);

  useEffect(() => {
    if (pageContent) {
      if (pageContent.title) setTitle(pageContent.title);
      if (pageContent.subtitle) setSubtitle(pageContent.subtitle);
      if (pageContent.wishes && Array.isArray(pageContent.wishes)) {
        setWishes(pageContent.wishes);
      }
    }
  }, [pageContent]);

  const createShootingStar = (clickX?: number, clickY?: number) => {
    const newStar: ShootingStar = {
      id: Date.now() + Math.random(),
      startX: clickX ?? Math.random() * window.innerWidth,
      startY: clickY ?? Math.random() * 300
    };

    setShootingStars(prev => [...prev, newStar]);

    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        createShootingStar();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleContainerClick = (e: React.MouseEvent) => {
    createShootingStar(e.clientX, e.clientY);
  };

  return (
    <WishesContainer onClick={handleContainerClick}>
      {/* Background twinkling stars */}
      {backgroundStars.map(star => (
        <Star
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Wishing stars (clickable) */}
      {wishingStars.map(star => (
        <WishingStar
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          whileHover={{ scale: 1.3 }}
          onClick={(e) => {
            e.stopPropagation();
            createShootingStar(e.clientX, e.clientY);
          }}
        >
          ⭐
        </WishingStar>
      ))}

      {/* Shooting stars */}
      {shootingStars.map(star => (
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
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <WishEmoji>{wish.emoji}</WishEmoji>
            <WishText>{wish.text}</WishText>
          </WishCard>
        ))}
      </WishesGrid>

      <ClickPrompt
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨
      </ClickPrompt>
    </WishesContainer>
  );
}
