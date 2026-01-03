import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useState } from 'react';

const QuizContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.pinkLavender};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuizCard = styled(motion.div)`
  max-width: 700px;
  width: 100%;
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  box-shadow: ${theme.shadows.soft};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing['2xl']};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FF6B9D 0%, #C8B6E2 100%);
`;

const QuestionNumber = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.weights.medium};
`;

const Question = styled(motion.h2)`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing['2xl']};
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.h3};
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Option = styled(motion.button)`
  background: ${theme.colors.glass.light};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.glass.medium};
    transform: translateX(8px);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #FF6B9D 0%, #C8B6E2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ResultCard = styled(motion.div)`
  text-align: center;
`;

const ResultEmoji = styled(motion.div)`
  font-size: 80px;
  margin-bottom: ${theme.spacing.lg};
`;

const ResultTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.h3};
  }
`;

const ResultText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.loose};
  margin-bottom: ${theme.spacing['2xl']};
`;

const RestartButton = styled(motion.button)`
  background: linear-gradient(135deg, #FF6B9D 0%, #C8B6E2 100%);
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: white;
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  box-shadow: ${theme.shadows.soft};

  &:hover {
    box-shadow: ${theme.shadows.glow};
  }
`;

const quizQuestions = [
  {
    question: "What's your ideal date night with me?",
    options: [
      "Cozy movie night at home with snacks",
      "Romantic dinner at a fancy restaurant",
      "Adventure outdoors - hiking or exploring",
      "Fun activity like bowling or arcade games"
    ]
  },
  {
    question: "How do you prefer to show affection?",
    options: [
      "Words of affirmation and sweet messages",
      "Physical touch and cuddles",
      "Acts of service and helpful gestures",
      "Thoughtful gifts and surprises"
    ]
  },
  {
    question: "What's our future home like?",
    options: [
      "Modern apartment in the city",
      "Cozy cottage in the countryside",
      "Beach house by the ocean",
      "Anywhere, as long as we're together"
    ]
  },
  {
    question: "Pick a vacation destination for us:",
    options: [
      "Paris, France - the city of love",
      "Tokyo, Japan - culture and adventure",
      "Maldives - tropical paradise",
      "New York - the city that never sleeps"
    ]
  },
  {
    question: "What's your favorite thing about us?",
    options: [
      "How we make each other laugh",
      "Our deep conversations",
      "Our shared dreams and goals",
      "How comfortable we are together"
    ]
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <QuizContainer>
      <QuizCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionNumber>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </QuestionNumber>

              <Question>
                {quizQuestions[currentQuestion].question}
              </Question>

              <OptionsContainer>
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Option
                    key={index}
                    onClick={() => handleAnswer(index)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </Option>
                ))}
              </OptionsContainer>
            </motion.div>
          ) : (
            <ResultCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResultEmoji
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💕
              </ResultEmoji>

              <ResultTitle>
                You Know Me So Well!
              </ResultTitle>

              <ResultText>
                Thank you for taking this quiz! Every answer you chose shows how much you
                understand and care about us. No matter what you picked, what matters most
                is that we're creating this beautiful journey together. Each moment with you
                is a treasure, and I'm so grateful for your love.
              </ResultText>

              <RestartButton
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take Quiz Again
              </RestartButton>
            </ResultCard>
          )}
        </AnimatePresence>
      </QuizCard>
    </QuizContainer>
  );
}
