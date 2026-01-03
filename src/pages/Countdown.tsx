import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useCountdown } from '../hooks/useCountdown';

const CountdownContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.peachyBlush};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
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
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.soft};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B9D 0%, #C8B6E2 100%);
  }
`;

const CountdownValue = styled(motion.div)`
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

// Default target: 1 year anniversary (Dec 4, 2026)
const DEFAULT_TARGET_DATE = new Date('2026-12-04T00:00:00');
const DEFAULT_EVENT_NAME = 'Our One Year Anniversary';

export default function Countdown() {
  const countdown = useCountdown(DEFAULT_TARGET_DATE);

  const countdownItems = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Minutes' },
    { value: countdown.seconds, label: 'Seconds' },
  ];

  if (countdown.isComplete) {
    return (
      <CountdownContainer>
        <CelebrationContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <CelebrationText>🎉 {DEFAULT_EVENT_NAME}! 🎉</CelebrationText>
          </motion.div>
          <Message>
            Happy anniversary, my love! Every moment with you is a celebration.
          </Message>
        </CelebrationContainer>
      </CountdownContainer>
    );
  }

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
          {DEFAULT_EVENT_NAME}
        </EventName>

        <CountdownGrid>
          {countdownItems.map((item, index) => (
            <CountdownBox
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <CountdownValue
                key={item.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {item.value}
              </CountdownValue>
              <CountdownLabel>{item.label}</CountdownLabel>
            </CountdownBox>
          ))}
        </CountdownGrid>

        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Every second brings us closer to another beautiful milestone in our journey together.
        </Message>
      </ContentWrapper>
    </CountdownContainer>
  );
}
