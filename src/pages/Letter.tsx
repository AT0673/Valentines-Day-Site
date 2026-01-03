import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { usePageContent } from '../hooks/usePageContent';

const LetterContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.pinkLavender};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LetterPaper = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  background: linear-gradient(135deg,
    rgba(255, 248, 240, 0.95) 0%,
    rgba(255, 244, 238, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 235, 220, 0.8);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing['4xl']};
  box-shadow:
    0 20px 60px rgba(255, 107, 157, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      repeating-linear-gradient(
        transparent,
        transparent 31px,
        rgba(255, 107, 157, 0.08) 31px,
        rgba(255, 107, 157, 0.08) 32px
      );
    pointer-events: none;
    border-radius: ${theme.borderRadius.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing['2xl']};
  }
`;

const LetterHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['3xl']};
  position: relative;
  z-index: 1;
`;

const DateStamp = styled(motion.div)`
  font-family: ${theme.typography.fonts.script};
  font-size: 20px;
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const Salutation = styled(motion.h2)`
  font-family: ${theme.typography.fonts.script};
  font-size: 48px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 36px;
  }
`;

const LetterContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Paragraph = styled(motion.p)`
  font-family: ${theme.typography.fonts.body};
  font-size: 18px;
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.loose};
  margin-bottom: ${theme.spacing.xl};
  text-indent: ${theme.spacing.xl};

  &:first-of-type {
    text-indent: 0;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const Signature = styled(motion.div)`
  text-align: right;
  margin-top: ${theme.spacing['3xl']};
  font-family: ${theme.typography.fonts.script};
  font-size: 32px;
  color: ${theme.colors.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const HeartDecoration = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  opacity: 0.3;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 30px;
    height: 30px;
  }
`;

export default function Letter() {
  const { content: pageContent } = usePageContent('letter');
  const [letterContent, setLetterContent] = useState<string>('');

  // Default letter content
  const defaultContent = `As I sit here thinking about us, I find myself overwhelmed with gratitude for every moment we've shared together. You've brought so much light, laughter, and love into my life that I sometimes wonder how I ever lived without you.

From our first conversation to this very moment, you've shown me what it means to truly connect with someone on every level. Your kindness, your humor, your intelligence, and your beautiful heart have captivated me completely. Every day with you feels like a gift I never knew I needed.

I love the way you laugh at my jokes, even the terrible ones. I love how you make everything more colorful, more meaningful, more alive. I love how you challenge me to be better, to dream bigger, to love deeper. With you, I've discovered parts of myself I didn't know existed.

This website is just a small token of how much you mean to me. Every page, every word, every moment captured here is a reflection of my love for you. But no website, no letter, no words could ever truly express the depth of what I feel.

Thank you for being you. Thank you for choosing me. Thank you for every smile, every hug, every shared dream. I can't wait to see what adventures await us, because I know that as long as we're together, every day will be extraordinary.`;

  useEffect(() => {
    if (pageContent?.content) {
      setLetterContent(pageContent.content);
    } else {
      setLetterContent(defaultContent);
    }
  }, [pageContent]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Split content into paragraphs for animation
  const paragraphs = letterContent.split('\n\n').filter(p => p.trim());

  return (
    <LetterContainer>
      <LetterPaper
        initial={{ opacity: 0, y: 30, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <HeartDecoration
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 35C20 35 5 25 5 15C5 10 8 7 12 7C15 7 17.5 9 20 12C22.5 9 25 7 28 7C32 7 35 10 35 15C35 25 20 35 20 35Z"
              fill="currentColor"
              style={{ color: theme.colors.primary }}
            />
          </svg>
        </HeartDecoration>

        <LetterHeader>
          <DateStamp
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {formattedDate}
          </DateStamp>

          <Salutation
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            My Dearest Judy,
          </Salutation>
        </LetterHeader>

        <LetterContent>
          {paragraphs.map((paragraph, index) => (
            <Paragraph
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              {paragraph}
            </Paragraph>
          ))}

          <Signature
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 + paragraphs.length * 0.1 }}
          >
            Forever yours, with all my love ♥
          </Signature>
        </LetterContent>
      </LetterPaper>
    </LetterContainer>
  );
}
