import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { theme } from '../styles/theme';
import { useCountdown } from '../hooks/useCountdown';

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

export default function Countdown() {
  useEffect(() => {
    console.log('Countdown component mounted');
    return () => console.log('Countdown component unmounted');
  }, []);

  const nextEvent = { name: 'Valentine\'s Day 2026 (YORK!)', date: '2026-02-14T00:00:00' };
  const countdown = useCountdown(new Date(nextEvent.date));

  const countdownItems = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Minutes' },
    { value: countdown.seconds, label: 'Seconds' },
  ];

  return (
    <CountdownContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Counting Down To
        </Title>

        <EventName
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {nextEvent.name}
        </EventName>

        <CountdownGrid>
          {countdownItems.map((item, index) => (
            <CountdownBox
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CountdownValue>{item.value}</CountdownValue>
              <CountdownLabel>{item.label}</CountdownLabel>
            </CountdownBox>
          ))}
        </CountdownGrid>

        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Welcome to my list of upcoming amazing moments and events with the most handsome amazing boyfriend.
        </Message>
      </ContentWrapper>
    </CountdownContainer>
  );
}
