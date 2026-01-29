import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { theme } from '../styles/theme';

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
