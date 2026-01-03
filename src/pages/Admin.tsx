import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useEvents, type CountdownEvent } from '../hooks/useEvents';
import { usePageContent, type PageContent } from '../hooks/usePageContent';
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

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
`;

const EventCard = styled(motion.div)`
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.soft};
`;

const EventCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${theme.spacing.md};
`;

const EventName = styled.h4`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h4};
  color: ${theme.colors.primary};
  margin: 0;
  flex: 1;
`;

const EventDate = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.sm} 0 0 0;
`;

const DeleteButton = styled(motion.button)`
  background: rgba(255, 59, 48, 0.2);
  border: none;
  color: #D32F2F;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: rgba(255, 59, 48, 0.3);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const FormLabel = styled.label`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.glass.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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

const CancelButton = styled(motion.button)`
  flex: 1;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.glass.medium};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['2xl']};
  flex-wrap: wrap;
  border-bottom: 2px solid ${theme.colors.glass.border};
  padding-bottom: ${theme.spacing.lg};
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.active ? 'linear-gradient(135deg, ' + theme.colors.primary + ' 0%, ' + theme.colors.secondary + ' 100%)' : theme.colors.glass.light};
  border: ${props => props.active ? 'none' : '2px solid ' + theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.active ? 'white' : theme.colors.text.primary};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PageEditorCard = styled(motion.div)`
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
`;

const EditorLabel = styled.label`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: ${theme.spacing.sm};
`;

const EditorInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.glass.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: white;
  }
`;

const EditorTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.glass.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.primary};
  box-sizing: border-box;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: white;
  }
`;

const SaveButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border: none;
  border-radius: ${theme.borderRadius.lg};
  color: white;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  width: 100%;
  box-shadow: ${theme.shadows.soft};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Event management state
  const { events, loading: eventsLoading, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState<CountdownEvent>({
    name: '',
    date: '',
    description: '',
  });
  const [savingEvent, setSavingEvent] = useState(false);

  // Page editing state
  const [activeTab, setActiveTab] = useState<string>('events');
  const [selectedPage, setSelectedPage] = useState<string>('letter');
  const pages = [
    { id: 'letter', name: 'Love Letter' },
    { id: 'timeline', name: 'Timeline' },
    { id: 'wishes', name: 'Wishes & Dreams' },
    { id: 'home', name: 'Home' },
  ];
  
  const { content: pageContent, updateContent: updatePageContent, loading: pageLoading } = usePageContent(selectedPage);
  const [editingContent, setEditingContent] = useState<PageContent>({});

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

  // Update editing content when page content changes
  useEffect(() => {
    if (pageContent) {
      setEditingContent(pageContent);
    } else {
      setEditingContent({});
    }
  }, [pageContent, selectedPage]);

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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    setSavingEvent(true);
    try {
      await addEvent({
        name: formData.name,
        date: formData.date,
        description: formData.description || '',
      });
      setFormData({ name: '', date: '', description: '' });
      setShowEventForm(false);
    } catch (err) {
      alert('Failed to add event');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleSavePage = async () => {
    try {
      setSavingEvent(true);
      const success = await updatePageContent(editingContent);
      if (success) {
        alert('Page content saved successfully!');
      } else {
        alert('Failed to save page content');
      }
    } catch (err) {
      alert('Error saving page content');
    } finally {
      setSavingEvent(false);
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
          <SectionTitle>Manage Countdown Events</SectionTitle>
          <InfoCard>
            <InfoText>
              Add, edit, or delete countdown events. These will automatically display on the countdown page,
              with the closest event always shown.
            </InfoText>
            <Button
              onClick={() => setShowEventForm(!showEventForm)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: theme.spacing.lg, width: '100%' }}
            >
              {showEventForm ? '✕ Cancel' : '+ Add New Event'}
            </Button>
          </InfoCard>

          <AnimatePresence>
            {showEventForm && (
              <InfoCard
                as={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <form onSubmit={handleAddEvent}>
                  <FormGroup>
                    <FormLabel>Event Name *</FormLabel>
                    <FormInput
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Our Anniversary"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date *</FormLabel>
                    <FormInput
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormTextarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add a description for this event..."
                    />
                  </FormGroup>

                  <ButtonGroup>
                    <SubmitButton
                      type="submit"
                      disabled={savingEvent}
                      whileHover={{ scale: savingEvent ? 1 : 1.02 }}
                      whileTap={{ scale: savingEvent ? 1 : 0.98 }}
                    >
                      {savingEvent ? 'Saving...' : 'Save Event'}
                    </SubmitButton>
                    <CancelButton
                      type="button"
                      onClick={() => {
                        setShowEventForm(false);
                        setFormData({ name: '', date: '', description: '' });
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </CancelButton>
                  </ButtonGroup>
                </form>
              </InfoCard>
            )}
          </AnimatePresence>

          {eventsLoading ? (
            <InfoCard>
              <InfoText>Loading events...</InfoText>
            </InfoCard>
          ) : events.length === 0 ? (
            <InfoCard>
              <InfoText>No events yet. Create your first countdown event!</InfoText>
            </InfoCard>
          ) : (
            <EventsGrid>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <EventCardHeader>
                    <div>
                      <EventName>{event.name}</EventName>
                      <EventDate>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </EventDate>
                    </div>
                    <DeleteButton
                      onClick={() => handleDeleteEvent(event.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </DeleteButton>
                  </EventCardHeader>
                  {event.description && (
                    <p style={{ margin: '0', fontSize: '14px', color: theme.colors.text.secondary }}>
                      {event.description}
                    </p>
                  )}
                </EventCard>
              ))}
            </EventsGrid>
          )}
        </Section>

        <Section>
          <SectionTitle>Edit Page Content</SectionTitle>
          
          <TabContainer>
            {pages.map((page) => (
              <Tab
                key={page.id}
                active={selectedPage === page.id}
                onClick={() => setSelectedPage(page.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page.name}
              </Tab>
            ))}
          </TabContainer>

          {pageLoading ? (
            <InfoCard>
              <InfoText>Loading page content...</InfoText>
            </InfoCard>
          ) : (
            <PageEditorCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FormGroup>
                <EditorLabel>Title</EditorLabel>
                <EditorInput
                  type="text"
                  value={editingContent.title || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  placeholder="Page title..."
                />
              </FormGroup>

              <FormGroup>
                <EditorLabel>Subtitle</EditorLabel>
                <EditorInput
                  type="text"
                  value={editingContent.subtitle || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, subtitle: e.target.value })}
                  placeholder="Page subtitle..."
                />
              </FormGroup>

              <FormGroup>
                <EditorLabel>Main Content</EditorLabel>
                <EditorTextarea
                  value={editingContent.content || editingContent.message || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value, message: e.target.value })}
                  placeholder="Enter page content..."
                />
              </FormGroup>

              <SaveButton
                disabled={savingEvent}
                onClick={handleSavePage}
                whileHover={{ scale: savingEvent ? 1 : 1.02 }}
                whileTap={{ scale: savingEvent ? 1 : 0.98 }}
              >
                {savingEvent ? 'Saving...' : 'Save Page Content'}
              </SaveButton>
            </PageEditorCard>
          )}
        </Section>

        <Section>
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
