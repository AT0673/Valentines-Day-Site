import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useReasons } from '../../hooks/useReasons';

const ReasonsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing['3xl']};
`;

const ReasonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  perspective: 1000px;
`;

const ReasonCard = styled(motion.div)<{ $depth: number }>`
  background: linear-gradient(
    135deg,
    rgba(255, 214, 232, 0.4) 0%,
    rgba(232, 214, 255, 0.4) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  min-width: 280px;
  max-width: 320px;
  box-shadow: ${theme.shadows.soft};
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(${props => props.$depth * 20}px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 100%;
    max-width: 100%;
  }
`;

const ReasonText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.loose};
  text-align: center;
`;

const ReasonNumber = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.primary};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.weights.semibold};
  font-size: 14px;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.typography.fonts.body};
`;

// Fallback placeholder data
const placeholderReasons = [
  "Your smile lights up my entire world and makes everything better",
  "The way you laugh at my silly jokes, even the terrible ones",
  "How you make me feel safe and loved every single day",
  "Your kindness and compassion for everyone around you",
  "The little notes you leave for me to find",
  "How you believe in me when I don't believe in myself",
  "Your love for lilies and how your eyes sparkle when you see them",
  "The way you make ordinary moments feel extraordinary",
  "Your beautiful mind and all our deep conversations",
  "How you hold my hand and make everything feel right",
];

export default function ReasonsGrid() {
  const { reasons, loading } = useReasons();

  // Use Firebase reasons if available, otherwise use placeholders
  const displayReasons = reasons.length > 0 ? reasons.map(r => r.text) : placeholderReasons;

  return (
    <ReasonsSection>
      <div className="container">
        <SectionTitle>Reasons I Adore You</SectionTitle>

        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : (
          <ReasonsContainer>
            {displayReasons.map((reason, index) => (
              <ReasonCard
                key={index}
                $depth={index % 3}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: '0 12px 48px rgba(255, 107, 157, 0.25)',
                  transition: { duration: 0.3 },
                }}
              >
                <ReasonNumber>{index + 1}</ReasonNumber>
                <ReasonText>{reason}</ReasonText>
              </ReasonCard>
            ))}
          </ReasonsContainer>
        )}
      </div>
    </ReasonsSection>
  );
}
