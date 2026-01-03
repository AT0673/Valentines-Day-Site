import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useLoveCounter } from '../../hooks/useLoveCounter';

const CounterContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
`;

const Title = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.h3};
  }
`;

const CounterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.md};
  }
`;

const CounterItem = styled(motion.div)`
  background: ${theme.colors.glass.light};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.soft};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const CounterValue = styled(motion.div)`
  font-family: ${theme.typography.fonts.display};
  font-size: 48px;
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary};
  font-variant-numeric: tabular-nums;
  line-height: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const CounterLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.caption};
  }
`;

interface LoveCounterProps {
  startDate: Date;
}

export default function LoveCounter({ startDate }: LoveCounterProps) {
  const counter = useLoveCounter(startDate);

  const counterItems = [
    { value: counter.years, label: 'Years' },
    { value: counter.months, label: 'Months' },
    { value: counter.days, label: 'Days' },
    { value: counter.hours, label: 'Hours' },
    { value: counter.minutes, label: 'Minutes' },
    { value: counter.seconds, label: 'Seconds' },
  ];

  return (
    <CounterContainer>
      <Title>Our Love Story In Numbers</Title>
      <CounterGrid>
        {counterItems.map((item, index) => (
          <CounterItem
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <CounterValue
              key={item.value}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {item.value}
            </CounterValue>
            <CounterLabel>{item.label}</CounterLabel>
          </CounterItem>
        ))}
      </CounterGrid>
    </CounterContainer>
  );
}
