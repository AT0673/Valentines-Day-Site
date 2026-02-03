import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useEvents, type CountdownEvent } from '../hooks/useEvents';
import { usePageContent, type PageContent } from '../hooks/usePageContent';
import { useTimelineEvents, type TimelineEvent } from '../hooks/useTimelineEvents';
import { useQuizQuestions, type QuizQuestion } from '../hooks/useQuizQuestions';
import { useDreams, type Dream } from '../hooks/useDreams';
import { useReasons, type Reason } from '../hooks/useReasons';
import { usePhotos } from '../hooks/usePhotos';
import type { User } from 'firebase/auth';
import { seedTimelineEvents, seedQuizQuestions, seedDreams, seedReasons } from '../utils/seedData';

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

const MainTabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['3xl']};
  flex-wrap: wrap;
  border-bottom: 2px solid ${theme.colors.glass.border};
  padding-bottom: ${theme.spacing.lg};
`;

const MainTab = styled(motion.button)<{ active: boolean }>`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
`;

const Card = styled(motion.div)`
  background: ${theme.colors.glass.medium};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.soft};
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

const SubmitButton = styled(motion.button)`
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
  flex: 1;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

const CancelButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: rgba(128, 128, 128, 0.2);
  border: 2px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  flex: 1;
`;

const DeleteButton = styled(motion.button)`
  background: rgba(255, 59, 48, 0.2);
  border: none;
  color: #D32F2F;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  flex: 1;

  &:hover {
    background: rgba(255, 59, 48, 0.3);
  }
`;

const UploadZone = styled(motion.div)<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? theme.colors.primary : theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  background: ${props => props.isDragging ? 'rgba(255, 107, 157, 0.1)' : theme.colors.glass.light};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${theme.spacing['2xl']};

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(255, 107, 157, 0.05);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.glass.medium};
  border: 1px solid ${theme.colors.glass.border};
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('events');

  // Hooks for all content types
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { events: timelineEvents, addEvent: addTimelineEvent, updateEvent: updateTimelineEvent, deleteEvent: deleteTimelineEvent } = useTimelineEvents();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuizQuestions();
  const { dreams, addDream, updateDream, deleteDream } = useDreams();
  const { reasons, addReason, updateReason, deleteReason } = useReasons();
  const { photos, uploading, uploadPhoto, deletePhoto } = usePhotos();

  // Page content
  const [selectedPage, setSelectedPage] = useState('letter');
  const { content: pageContent, updateContent: updatePageContent, loading: pageLoading } = usePageContent(selectedPage);
  const [editingContent, setEditingContent] = useState<PageContent>({});

  // Form states
  const [eventForm, setEventForm] = useState<CountdownEvent>({ name: '', date: '', description: '', yearlyRecurring: false });
  const [timelineForm, setTimelineForm] = useState<TimelineEvent>({ date: '', title: '', description: '', emoji: '💕' });
  const [quizForm, setQuizForm] = useState<QuizQuestion>({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  const [dreamForm, setDreamForm] = useState<Dream>({ title: '', description: '', icon: '✨' });
  const [reasonForm, setReasonForm] = useState<Reason>({ text: '' });

  // Edit states
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingDreamId, setEditingDreamId] = useState<string | null>(null);
  const [editingReasonId, setEditingReasonId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setError('Firebase is not configured');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (pageContent) {
      setEditingContent(pageContent);
    } else {
      setEditingContent({});
    }
  }, [pageContent, selectedPage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !isFirebaseConfigured) return;

    setError('');
    setLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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

  const handleSeedDatabase = async () => {
    if (!confirm('This will populate the database with initial content. Are you sure?')) return;

    setSaving(true);
    try {
      // Seed timeline events
      for (const event of seedTimelineEvents) {
        await addTimelineEvent(event);
      }

      // Seed quiz questions
      for (const question of seedQuizQuestions) {
        await addQuestion(question);
      }

      // Seed dreams
      for (const dream of seedDreams) {
        await addDream(dream);
      }

      // Seed reasons
      for (const reason of seedReasons) {
        await addReason(reason);
      }

      alert('Database seeded successfully! All content is now editable.');
    } catch (err) {
      alert('Failed to seed database: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Event handlers
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addEvent(eventForm);
      setEventForm({ name: '', date: '', description: '', yearlyRecurring: false });
      alert('Event added!');
    } catch (err) {
      alert('Failed to add event');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId) return;
    setSaving(true);
    try {
      await updateEvent(editingEventId, eventForm);
      setEditingEventId(null);
      setEventForm({ name: '', date: '', description: '', yearlyRecurring: false });
      alert('Event updated!');
    } catch (err) {
      alert('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addTimelineEvent(timelineForm);
      setTimelineForm({ date: '', title: '', description: '', emoji: '💕' });
      alert('Timeline event added!');
    } catch (err) {
      alert('Failed to add timeline event');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuizQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addQuestion(quizForm);
      setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
      alert('Quiz question added!');
    } catch (err) {
      alert('Failed to add quiz question');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDream(dreamForm);
      setDreamForm({ title: '', description: '', icon: '✨' });
      alert('Dream added!');
    } catch (err) {
      alert('Failed to add dream');
    } finally {
      setSaving(false);
    }
  };

  const handleAddReason = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addReason(reasonForm);
      setReasonForm({ text: '' });
      alert('Reason added!');
    } catch (err) {
      alert('Failed to add reason');
    } finally {
      setSaving(false);
    }
  };

  // Update handlers
  const handleUpdateTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimelineId) return;
    setSaving(true);
    try {
      await updateTimelineEvent(editingTimelineId, timelineForm);
      setEditingTimelineId(null);
      setTimelineForm({ date: '', title: '', description: '', emoji: '💕' });
      alert('Timeline event updated!');
    } catch (err) {
      alert('Failed to update timeline event');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuizQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuizId) return;
    setSaving(true);
    try {
      await updateQuestion(editingQuizId, quizForm);
      setEditingQuizId(null);
      setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
      alert('Quiz question updated!');
    } catch (err) {
      alert('Failed to update quiz question');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDreamId) return;
    setSaving(true);
    try {
      await updateDream(editingDreamId, dreamForm);
      setEditingDreamId(null);
      setDreamForm({ title: '', description: '', icon: '✨' });
      alert('Dream updated!');
    } catch (err) {
      alert('Failed to update dream');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReasonId) return;
    setSaving(true);
    try {
      await updateReason(editingReasonId, reasonForm);
      setEditingReasonId(null);
      setReasonForm({ text: '' });
      alert('Reason updated!');
    } catch (err) {
      alert('Failed to update reason');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async () => {
    setSaving(true);
    try {
      const success = await updatePageContent(editingContent);
      if (success) {
        alert('Page content saved!');
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  // Photo upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          await uploadPhoto(file);
        } catch (err) {
          alert('Failed to upload photo');
        }
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        await uploadPhoto(file);
      } catch (err) {
        alert('Failed to upload photo');
      }
    }
  };

  if (loading) {
    return (
      <AdminContainer>
        <LoginCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Title>Loading...</Title>
        </LoginCard>
      </AdminContainer>
    );
  }

  if (!user) {
    return (
      <AdminContainer>
        <LoginCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Title>Admin Login</Title>
          <Form onSubmit={handleLogin}>
            <InputGroup>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loggingIn} />
            </InputGroup>
            <InputGroup>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loggingIn} />
            </InputGroup>
            <AnimatePresence>
              {error && (
                <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {error}
                </ErrorMessage>
              )}
            </AnimatePresence>
            <Button type="submit" disabled={loggingIn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          <WelcomeText>Admin Dashboard</WelcomeText>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <LogoutButton
              onClick={handleSeedDatabase}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={saving}
              style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
            >
              {saving ? 'Seeding...' : 'Seed Database'}
            </LogoutButton>
            <LogoutButton onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Sign Out
            </LogoutButton>
          </div>
        </Header>

        <MainTabContainer>
          {[
            { id: 'events', name: 'Countdown Events' },
            { id: 'timeline', name: 'Timeline' },
            { id: 'quiz', name: 'Quiz' },
            { id: 'dreams', name: 'Dreams' },
            { id: 'reasons', name: 'Reasons' },
            { id: 'photos', name: 'Photos' },
            { id: 'pages', name: 'Page Content' },
          ].map((tab) => (
            <MainTab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.name}
            </MainTab>
          ))}
        </MainTabContainer>

        {/* COUNTDOWN EVENTS */}
        {activeTab === 'events' && (
          <Section>
            <SectionTitle>{editingEventId ? 'Edit' : 'Add'} Countdown Event</SectionTitle>
            <InfoCard>
              <form onSubmit={editingEventId ? handleUpdateEvent : handleAddEvent}>
                <FormGroup>
                  <FormLabel>Event Name *</FormLabel>
                  <FormInput value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Date *</FormLabel>
                  <FormInput type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <FormTextarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
                </FormGroup>
                <FormGroup>
                  <FormLabel style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'none' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.yearlyRecurring || false}
                      onChange={(e) => setEventForm({ ...eventForm, yearlyRecurring: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    Yearly Recurring (event repeats every year)
                  </FormLabel>
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? 'Saving...' : (editingEventId ? 'Update' : 'Add')}
                  </SubmitButton>
                  {editingEventId && (
                    <CancelButton type="button" onClick={() => { setEditingEventId(null); setEventForm({ name: '', date: '', description: '', yearlyRecurring: false }); }} whileHover={{ scale: 1.02 }}>
                      Cancel
                    </CancelButton>
                  )}
                </ButtonGroup>
              </form>
            </InfoCard>
            <Grid>
              {events.map((event) => (
                <Card key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{event.name}</h4>
                  <p>{new Date(event.date).toLocaleString()}</p>
                  {event.description && <p>{event.description}</p>}
                  {event.yearlyRecurring && <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>🔄 Yearly Recurring</p>}
                  <ButtonGroup>
                    <SubmitButton type="button" onClick={() => { setEditingEventId(event.id!); setEventForm(event); }} whileHover={{ scale: 1.05 }}>Edit</SubmitButton>
                    <DeleteButton type="button" onClick={() => deleteEvent(event.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                  </ButtonGroup>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* TIMELINE EVENTS */}
        {activeTab === 'timeline' && (
          <Section>
            <SectionTitle>{editingTimelineId ? 'Edit' : 'Add'} Timeline Event</SectionTitle>
            <InfoCard>
              <form onSubmit={editingTimelineId ? handleUpdateTimelineEvent : handleAddTimelineEvent}>
                <FormGroup>
                  <FormLabel>Date *</FormLabel>
                  <FormInput type="date" value={timelineForm.date} onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Title *</FormLabel>
                  <FormInput value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <FormTextarea value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Emoji</FormLabel>
                  <FormInput value={timelineForm.emoji} onChange={(e) => setTimelineForm({ ...timelineForm, emoji: e.target.value })} />
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? 'Saving...' : (editingTimelineId ? 'Update' : 'Add')}
                  </SubmitButton>
                  {editingTimelineId && (
                    <CancelButton type="button" onClick={() => { setEditingTimelineId(null); setTimelineForm({ date: '', title: '', description: '', emoji: '💕' }); }} whileHover={{ scale: 1.02 }}>
                      Cancel
                    </CancelButton>
                  )}
                </ButtonGroup>
              </form>
            </InfoCard>
            <Grid>
              {timelineEvents.map((event) => (
                <Card key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{event.emoji} {event.title}</h4>
                  <p>{event.date}</p>
                  <p>{event.description}</p>
                  <ButtonGroup>
                    <SubmitButton type="button" onClick={() => { setEditingTimelineId(event.id!); setTimelineForm(event); }} whileHover={{ scale: 1.05 }}>Edit</SubmitButton>
                    <DeleteButton type="button" onClick={() => deleteTimelineEvent(event.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                  </ButtonGroup>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* QUIZ QUESTIONS */}
        {activeTab === 'quiz' && (
          <Section>
            <SectionTitle>{editingQuizId ? 'Edit' : 'Add'} Quiz Question</SectionTitle>
            <InfoCard>
              <form onSubmit={editingQuizId ? handleUpdateQuizQuestion : handleAddQuizQuestion}>
                <FormGroup>
                  <FormLabel>Question *</FormLabel>
                  <FormInput value={quizForm.question} onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })} required />
                </FormGroup>
                {quizForm.options.map((opt, idx) => (
                  <FormGroup key={idx}>
                    <FormLabel>Option {idx + 1} *</FormLabel>
                    <FormInput
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...quizForm.options];
                        newOpts[idx] = e.target.value;
                        setQuizForm({ ...quizForm, options: newOpts });
                      }}
                      required
                    />
                  </FormGroup>
                ))}
                <FormGroup>
                  <FormLabel>Correct Answer (0-3)</FormLabel>
                  <FormInput type="number" min="0" max="3" value={quizForm.correctAnswer} onChange={(e) => setQuizForm({ ...quizForm, correctAnswer: parseInt(e.target.value) })} required />
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? 'Saving...' : (editingQuizId ? 'Update' : 'Add')}
                  </SubmitButton>
                  {editingQuizId && (
                    <CancelButton type="button" onClick={() => { setEditingQuizId(null); setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0 }); }} whileHover={{ scale: 1.02 }}>
                      Cancel
                    </CancelButton>
                  )}
                </ButtonGroup>
              </form>
            </InfoCard>
            <Grid>
              {questions.map((q) => (
                <Card key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{q.question}</h4>
                  {q.options.map((opt, idx) => (
                    <p key={idx} style={{ fontWeight: idx === q.correctAnswer ? 'bold' : 'normal' }}>
                      {idx + 1}. {opt} {idx === q.correctAnswer && '✓'}
                    </p>
                  ))}
                  <ButtonGroup>
                    <SubmitButton type="button" onClick={() => { setEditingQuizId(q.id!); setQuizForm(q); }} whileHover={{ scale: 1.05 }}>Edit</SubmitButton>
                    <DeleteButton type="button" onClick={() => deleteQuestion(q.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                  </ButtonGroup>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* DREAMS */}
        {activeTab === 'dreams' && (
          <Section>
            <SectionTitle>{editingDreamId ? 'Edit' : 'Add'} Dream</SectionTitle>
            <InfoCard>
              <form onSubmit={editingDreamId ? handleUpdateDream : handleAddDream}>
                <FormGroup>
                  <FormLabel>Title *</FormLabel>
                  <FormInput value={dreamForm.title} onChange={(e) => setDreamForm({ ...dreamForm, title: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Description *</FormLabel>
                  <FormTextarea value={dreamForm.description} onChange={(e) => setDreamForm({ ...dreamForm, description: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Icon (emoji)</FormLabel>
                  <FormInput value={dreamForm.icon} onChange={(e) => setDreamForm({ ...dreamForm, icon: e.target.value })} />
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? 'Saving...' : (editingDreamId ? 'Update' : 'Add')}
                  </SubmitButton>
                  {editingDreamId && (
                    <CancelButton type="button" onClick={() => { setEditingDreamId(null); setDreamForm({ title: '', description: '', icon: '✨' }); }} whileHover={{ scale: 1.02 }}>
                      Cancel
                    </CancelButton>
                  )}
                </ButtonGroup>
              </form>
            </InfoCard>
            <Grid>
              {dreams.map((dream) => (
                <Card key={dream.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{dream.icon} {dream.title}</h4>
                  <p>{dream.description}</p>
                  <ButtonGroup>
                    <SubmitButton type="button" onClick={() => { setEditingDreamId(dream.id!); setDreamForm(dream); }} whileHover={{ scale: 1.05 }}>Edit</SubmitButton>
                    <DeleteButton type="button" onClick={() => deleteDream(dream.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                  </ButtonGroup>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* REASONS */}
        {activeTab === 'reasons' && (
          <Section>
            <SectionTitle>{editingReasonId ? 'Edit' : 'Add'} Reason I Love You</SectionTitle>
            <InfoCard>
              <form onSubmit={editingReasonId ? handleUpdateReason : handleAddReason}>
                <FormGroup>
                  <FormLabel>Reason *</FormLabel>
                  <FormInput value={reasonForm.text} onChange={(e) => setReasonForm({ text: e.target.value })} required />
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? 'Saving...' : (editingReasonId ? 'Update' : 'Add')}
                  </SubmitButton>
                  {editingReasonId && (
                    <CancelButton type="button" onClick={() => { setEditingReasonId(null); setReasonForm({ text: '' }); }} whileHover={{ scale: 1.02 }}>
                      Cancel
                    </CancelButton>
                  )}
                </ButtonGroup>
              </form>
            </InfoCard>
            <Grid>
              {reasons.map((reason) => (
                <Card key={reason.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p>{reason.text}</p>
                  <ButtonGroup>
                    <SubmitButton type="button" onClick={() => { setEditingReasonId(reason.id!); setReasonForm(reason); }} whileHover={{ scale: 1.05 }}>Edit</SubmitButton>
                    <DeleteButton type="button" onClick={() => deleteReason(reason.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                  </ButtonGroup>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <Section>
            <SectionTitle>Manage Photo Gallery</SectionTitle>
            <UploadZone
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
            >
              <p>{uploading ? '📤 Uploading...' : '📸 Click or drag photos here'}</p>
            </UploadZone>
            <HiddenInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} />
            <PhotoGrid>
              {photos.map((photo) => (
                <PhotoCard key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PhotoImage src={photo.url} alt="" />
                  <DeleteButton onClick={() => deletePhoto(photo.id!, photo.url)} whileHover={{ scale: 1.05 }} style={{ position: 'absolute', top: 8, right: 8 }}>
                    Delete
                  </DeleteButton>
                </PhotoCard>
              ))}
            </PhotoGrid>
          </Section>
        )}

        {/* PAGE CONTENT */}
        {activeTab === 'pages' && (
          <Section>
            <SectionTitle>Edit Page Content</SectionTitle>
            <MainTabContainer>
              {[
                { id: 'letter', name: 'Love Letter' },
                { id: 'timeline', name: 'Timeline' },
                { id: 'wishes', name: 'Wishes' },
                { id: 'home', name: 'Home' },
              ].map((page) => (
                <MainTab
                  key={page.id}
                  active={selectedPage === page.id}
                  onClick={() => setSelectedPage(page.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page.name}
                </MainTab>
              ))}
            </MainTabContainer>
            {pageLoading ? (
              <p>Loading...</p>
            ) : (
              <InfoCard>
                <FormGroup>
                  <FormLabel>Title</FormLabel>
                  <FormInput value={editingContent.title || ''} onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Subtitle</FormLabel>
                  <FormInput value={editingContent.subtitle || ''} onChange={(e) => setEditingContent({ ...editingContent, subtitle: e.target.value })} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Content</FormLabel>
                  <FormTextarea value={editingContent.content || editingContent.message || ''} onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value, message: e.target.value })} />
                </FormGroup>
                <SubmitButton onClick={handleSavePage} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Save Page Content'}
                </SubmitButton>
              </InfoCard>
            )}
          </Section>
        )}
      </DashboardContainer>
    </AdminContainer>
  );
}
