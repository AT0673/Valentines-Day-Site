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
  width: 100%;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(motion.button)`
  background: rgba(255, 59, 48, 0.2);
  border: none;
  color: #D32F2F;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  margin-top: ${theme.spacing.sm};

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
  const { events, addEvent, deleteEvent } = useEvents();
  const { events: timelineEvents, addEvent: addTimelineEvent, deleteEvent: deleteTimelineEvent } = useTimelineEvents();
  const { questions, addQuestion, deleteQuestion } = useQuizQuestions();
  const { dreams, addDream, deleteDream } = useDreams();
  const { reasons, addReason, deleteReason } = useReasons();
  const { photos, uploading, uploadPhoto, deletePhoto } = usePhotos();

  // Page content
  const [selectedPage, setSelectedPage] = useState('letter');
  const { content: pageContent, updateContent: updatePageContent, loading: pageLoading } = usePageContent(selectedPage);
  const [editingContent, setEditingContent] = useState<PageContent>({});

  // Form states
  const [eventForm, setEventForm] = useState<CountdownEvent>({ name: '', date: '', description: '' });
  const [timelineForm, setTimelineForm] = useState<TimelineEvent>({ date: '', title: '', description: '', emoji: '💕' });
  const [quizForm, setQuizForm] = useState<QuizQuestion>({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  const [dreamForm, setDreamForm] = useState<Dream>({ title: '', description: '', icon: '✨' });
  const [reasonForm, setReasonForm] = useState<Reason>({ text: '' });

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

  // Event handlers
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addEvent(eventForm);
      setEventForm({ name: '', date: '', description: '' });
      alert('Event added!');
    } catch (err) {
      alert('Failed to add event');
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
          <LogoutButton onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Sign Out
          </LogoutButton>
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
            <SectionTitle>Manage Countdown Events</SectionTitle>
            <InfoCard>
              <form onSubmit={handleAddEvent}>
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
                <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Add Event'}
                </SubmitButton>
              </form>
            </InfoCard>
            <Grid>
              {events.map((event) => (
                <Card key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{event.name}</h4>
                  <p>{new Date(event.date).toLocaleString()}</p>
                  {event.description && <p>{event.description}</p>}
                  <DeleteButton onClick={() => deleteEvent(event.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* TIMELINE EVENTS */}
        {activeTab === 'timeline' && (
          <Section>
            <SectionTitle>Manage Timeline Events</SectionTitle>
            <InfoCard>
              <form onSubmit={handleAddTimelineEvent}>
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
                <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Add Timeline Event'}
                </SubmitButton>
              </form>
            </InfoCard>
            <Grid>
              {timelineEvents.map((event) => (
                <Card key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{event.emoji} {event.title}</h4>
                  <p>{event.date}</p>
                  <p>{event.description}</p>
                  <DeleteButton onClick={() => deleteTimelineEvent(event.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* QUIZ QUESTIONS */}
        {activeTab === 'quiz' && (
          <Section>
            <SectionTitle>Manage Quiz Questions</SectionTitle>
            <InfoCard>
              <form onSubmit={handleAddQuizQuestion}>
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
                <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Add Quiz Question'}
                </SubmitButton>
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
                  <DeleteButton onClick={() => deleteQuestion(q.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* DREAMS */}
        {activeTab === 'dreams' && (
          <Section>
            <SectionTitle>Manage Dreams</SectionTitle>
            <InfoCard>
              <form onSubmit={handleAddDream}>
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
                <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Add Dream'}
                </SubmitButton>
              </form>
            </InfoCard>
            <Grid>
              {dreams.map((dream) => (
                <Card key={dream.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4>{dream.icon} {dream.title}</h4>
                  <p>{dream.description}</p>
                  <DeleteButton onClick={() => deleteDream(dream.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
                </Card>
              ))}
            </Grid>
          </Section>
        )}

        {/* REASONS */}
        {activeTab === 'reasons' && (
          <Section>
            <SectionTitle>Manage Reasons I Love You</SectionTitle>
            <InfoCard>
              <form onSubmit={handleAddReason}>
                <FormGroup>
                  <FormLabel>Reason *</FormLabel>
                  <FormInput value={reasonForm.text} onChange={(e) => setReasonForm({ text: e.target.value })} required />
                </FormGroup>
                <SubmitButton type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving...' : 'Add Reason'}
                </SubmitButton>
              </form>
            </InfoCard>
            <Grid>
              {reasons.map((reason) => (
                <Card key={reason.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p>{reason.text}</p>
                  <DeleteButton onClick={() => deleteReason(reason.id!)} whileHover={{ scale: 1.05 }}>Delete</DeleteButton>
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
