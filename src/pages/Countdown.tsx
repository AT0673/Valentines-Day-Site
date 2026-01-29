import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { useCountdown } from '../hooks/useCountdown';
import { useEvents } from '../hooks/useEvents';

const CountdownContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg} 0;
  background: ${theme.colors.gradients.peachyBlush};
`;

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding-top: ${theme.spacing['2xl']};
  padding-bottom: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${theme.spacing['4xl']} - 140px);
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

const EventName = styled(motion.p)`
  font-family: ${theme.typography.fonts.script};
  font-size: 32px;
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.lg};
  }
`;

const CountdownBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.soft};
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B9D 0%, #C8B6E2 100%);
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
  }
`;

const CountdownValue = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: 72px;
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary};
  font-variant-numeric: tabular-nums;
  line-height: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 48px;
  }
`;

const CountdownLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${theme.typography.weights.medium};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.small};
  }
`;

const Message = styled(motion.p)`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.h4};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.loose};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.body};
  }
`;

const CelebrationContainer = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${theme.spacing['4xl']} - 140px);
  padding: ${theme.spacing['2xl']};
  padding-bottom: 140px;
`;

const CelebrationText = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: 48px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const UpcomingTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: 28px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 22px;
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  align-items: center;
`;

const EventItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(4px) scale(1.02);
  }
`;

const EventItemName = styled.p`
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing.sm};
`;

const EventItemDate = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
`;

// Array of important events - fallback if Firebase is not configured
const DEFAULT_EVENTS = [
  {
    id: '1',
    date: '2026-12-04T00:00:00',
    name: 'Our One Year Anniversary',
  },
  {
    id: '2',
    date: '2026-02-14T00:00:00',
    name: 'Valentine\'s Day 2026 (YORK!)',
  },
  {
    id: '3',
    date: '2027-02-14T00:00:00',
    name: 'Valentine\'s Day 2027',
  },
  {
    id: '4',
    date: '2026-06-08T00:00:00',
    name: 'China Trip Begins...'
  },
  {
    id: '5',
    date: '2027-12-04T00:00:00',
    name: 'Our Two Year Anniversary',
  },
  {
    id: '6',
    date: '2028-02-14T00:00:00',
    name: 'Valentine\'s Day 2028',
  },
  {
    id: '7',
    date: '2028-12-04T00:00:00',
    name: 'Our Three Year Anniversary',
  },
];

export default function Countdown() {
  // Debug logging
  useEffect(() => {
    console.log('Countdown component mounted');
    return () => console.log('Countdown component unmounted');
  }, []);

  return (
    <CountdownContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          TEST COUNTDOWN PAGE
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          If you can navigate away from here, the issue is in the component logic
        </Subtitle>
      </ContentWrapper>
    </CountdownContainer>
  );
}
