import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { usePageContent } from '../hooks/usePageContent';

const TimelineContainer = styled.div`
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

const TimelinePath = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg,
      rgba(255, 107, 157, 0.3) 0%,
      rgba(200, 182, 226, 0.3) 100%
    );
    transform: translateX(-50%);

    @media (max-width: ${theme.breakpoints.mobile}) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)<{ alignment: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.alignment === 'left' ? 'flex-start' : 'flex-end'};
  margin-bottom: ${theme.spacing['3xl']};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    justify-content: flex-end;
  }
`;

const TimelineCard = styled(motion.div)`
  width: 45%;
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.soft};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: calc(100% - 80px);
  }
`;

const TimelineDot = styled.div<{ alignment: 'left' | 'right' }>`
  position: absolute;
  left: 50%;
  top: 30px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #FF6B9D 0%, #C8B6E2 100%);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
  z-index: 2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    left: 30px;
  }
`;

const LilyDecoration = styled.div<{ alignment: 'left' | 'right' }>`
  position: absolute;
  ${props => props.alignment === 'left' ? 'right: -15px;' : 'left: -15px;'}
  top: 20px;
  width: 30px;
  height: 30px;
  opacity: 0.6;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const DateLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.sm};
`;

const EventTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h3};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const EventDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.loose};
`;

const timelineEvents = [
  {
    date: 'December 4, 2025',
    title: 'The Day We Met',
    description: 'Our story began on this magical day. From the first moment, I knew there was something special about you.',
  },
  {
    date: 'December 25, 2025',
    title: 'First Christmas Together',
    description: 'Our first holiday together, filled with warmth, laughter, and the beginning of many traditions.',
  },
  {
    date: 'February 14, 2026',
    title: "Our First Valentine's Day",
    description: "A celebration of our love, and the creation of this website to capture all our precious moments together.",
  },
  {
    date: 'December 4, 2026',
    title: 'One Year Anniversary',
    description: 'A whole year of love, laughter, growth, and unforgettable memories. Here\'s to many more years together.',
  },
];

export default function Timeline() {
  const { content: pageContent } = usePageContent('timeline');
  const [events, setEvents] = useState(timelineEvents);
  const [title, setTitle] = useState('Our Journey Together');
  const [subtitle, setSubtitle] = useState('Every moment is a milestone');

  useEffect(() => {
    if (pageContent) {
      if (pageContent.title) setTitle(pageContent.title);
      if (pageContent.subtitle) setSubtitle(pageContent.subtitle);
      if (pageContent.events && Array.isArray(pageContent.events)) {
        setEvents(pageContent.events);
      }
    }
  }, [pageContent]);

  return (
    <TimelineContainer>
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

      <TimelinePath>
        {events.map((event, index) => {
          const alignment = index % 2 === 0 ? 'left' : 'right';

          return (
            <TimelineItem key={index} alignment={alignment}>
              <TimelineDot alignment={alignment} />

              <TimelineCard
                initial={{ opacity: 0, x: alignment === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <LilyDecoration alignment={alignment}>
                  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 5C15 5 10 8 10 12C10 14 11 15 12.5 15C13 15 13.5 14.8 14 14.5C14 16 14.5 17.5 15 18C15.5 17.5 16 16 16 14.5C16.5 14.8 17 15 17.5 15C19 15 20 14 20 12C20 8 15 5 15 5Z"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <circle cx="15" cy="20" r="2" fill="currentColor" opacity="0.6" />
                  </svg>
                </LilyDecoration>

                <DateLabel>{event.date}</DateLabel>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
              </TimelineCard>
            </TimelineItem>
          );
        })}
      </TimelinePath>
    </TimelineContainer>
  );
}
