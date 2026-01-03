import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

const AdminContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['4xl']} ${theme.spacing.lg};
  padding-bottom: 120px;
  background: ${theme.colors.gradients.peachyBlush};
`;

const LoginCard = styled(motion.div)`
  max-width: 500px;
  margin: 100px auto;
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  box-shadow: ${theme.shadows.soft};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.glass.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: white;
  }
`;

const Button = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border: none;
  border-radius: ${theme.borderRadius.lg};
  color: white;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  box-shadow: ${theme.shadows.soft};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  padding: ${theme.spacing.md};
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: ${theme.borderRadius.md};
  color: #D32F2F;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  text-align: center;
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing['3xl']};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const WelcomeText = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h3};
  color: ${theme.colors.primary};
`;

const LogoutButton = styled(motion.button)`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.glass.medium};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.glass.light};
  }
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing['3xl']};
`;

const SectionTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h4};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const InfoCard = styled.div`
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
`;

const InfoText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.loose};
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Code = styled.code`
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: ${theme.colors.primary};
`;

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setError('Firebase is not configured. Please add your Firebase credentials to .env file.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth || !isFirebaseConfigured) {
      setError('Firebase is not configured. Please add your Firebase credentials to .env file.');
      return;
    }

    setError('');
    setLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <AdminContainer>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Title>Loading...</Title>
        </LoginCard>
      </AdminContainer>
    );
  }

  if (!user) {
    return (
      <AdminContainer>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Admin Login</Title>

          <Form onSubmit={handleLogin}>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loggingIn}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loggingIn}
              />
            </InputGroup>

            <AnimatePresence>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loggingIn}
              whileHover={{ scale: loggingIn ? 1 : 1.02 }}
              whileTap={{ scale: loggingIn ? 1 : 0.98 }}
            >
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
        </LoginCard>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <DashboardContainer>
        <Header>
          <WelcomeText>Welcome, {user.email}!</WelcomeText>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Out
          </LogoutButton>
        </Header>

        <Section>
          <SectionTitle>Admin Dashboard</SectionTitle>
          <InfoCard>
            <InfoText>
              Welcome to the Valentine's Day website admin panel. This is where you can manage
              content, upload photos, and customize the experience.
            </InfoText>
          </InfoCard>
        </Section>

        <Section>
          <SectionTitle>Quick Setup Guide</SectionTitle>
          <InfoCard>
            <InfoText>
              <strong>1. Firebase Configuration:</strong> Make sure you've created a <Code>.env</Code> file
              based on <Code>.env.example</Code> and filled in your Firebase credentials.
            </InfoText>
            <InfoText>
              <strong>2. Photo Gallery:</strong> Photos can be uploaded to Firebase Storage and managed
              through the PhotoGallery component. Update the photo URLs in the component or store them
              in Firestore.
            </InfoText>
            <InfoText>
              <strong>3. Countdown Date:</strong> The anniversary countdown is currently set to December 4, 2026.
              You can change this in <Code>src/pages/Countdown.tsx</Code>.
            </InfoText>
            <InfoText>
              <strong>4. Timeline Events:</strong> Edit relationship milestones in <Code>src/pages/Timeline.tsx</Code>.
            </InfoText>
            <InfoText>
              <strong>5. Love Letter:</strong> Customize the romantic letter content in <Code>src/pages/Letter.tsx</Code>.
            </InfoText>
          </InfoCard>
        </Section>

        <Section>
          <SectionTitle>Future Enhancements</SectionTitle>
          <InfoCard>
            <InfoText>
              This admin panel can be extended with:
            </InfoText>
            <InfoText>• Rich text editor for the love letter</InfoText>
            <InfoText>• Photo upload interface with drag & drop</InfoText>
            <InfoText>• Timeline event manager (add/edit/delete)</InfoText>
            <InfoText>• Quiz question editor</InfoText>
            <InfoText>• Dreams and wishes content manager</InfoText>
            <InfoText>• Analytics dashboard showing page views</InfoText>
          </InfoCard>
        </Section>
      </DashboardContainer>
    </AdminContainer>
  );
}
