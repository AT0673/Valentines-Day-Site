import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { usePageContent } from '../hooks/usePageContent';
import RotatingHeart from '../components/Hearts/RotatingHeart';
import LoveCounter from '../components/shared/LoveCounter';
import PhotoGallery from '../components/Gallery/PhotoGallery';
import ReasonsGrid from '../components/shared/ReasonsGrid';
import { g } from 'framer-motion/client';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['3xl']} 0;
  padding-bottom: 120px; /* Space for bottom nav */
  background: ${theme.colors.gradients.pinkLavender};
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
`;

const Title = styled(motion.h1)`
  font-family: ${theme.typography.fonts.display};
  font-size: 64px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  background: linear-gradient(135deg, #FF6B9D 0%, #C8B6E2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 42px;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 28px;
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 22px;
  }
`;

// Relationship start date: December 4, 2025
const RELATIONSHIP_START_DATE = new Date('2025-12-04T00:00:00');

export default function Home() {
  const { content: pageContent } = usePageContent('home');
  const [title, setTitle] = useState('Hello my beautiful girlfriend');
  const [subtitle, setSubtitle] = useState('you\'re so gorgeous');

  useEffect(() => {
    if (pageContent) {
      if (pageContent.title) setTitle(pageContent.title);
      if (pageContent.subtitle) setSubtitle(pageContent.subtitle);
    }
  }, [pageContent]);

  return (
    <HomeContainer>
      <HeroSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </Subtitle>

        <RotatingHeart />
      </HeroSection>

      <LoveCounter startDate={RELATIONSHIP_START_DATE} />

      <PhotoGallery />

      <ReasonsGrid />
    </HomeContainer>
  );
}
