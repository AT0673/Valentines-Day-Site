# Admin Panel Extension Guide

This guide explains how to use the created hooks and components to extend the admin panel with full content management capabilities.

## ✅ What's Already Created

### Hooks for Content Management

All hooks are located in `src/hooks/` and ready to use:

1. **useEvents.ts** - Manage countdown events (✅ Already integrated in Admin)
2. **usePageContent.ts** - Edit page content (✅ Already integrated in Admin)
3. **useTimelineEvents.ts** - Manage timeline events (NEW)
4. **useQuizQuestions.ts** - Manage quiz questions (NEW)
5. **useDreams.ts** - Manage dreams/future goals (NEW)
6. **useReasons.ts** - Manage "reasons I love you" grid (NEW)
7. **usePhotos.ts** - Upload and manage photos (NEW)

### Components

- **PhotoManager.tsx** - Full drag-and-drop photo upload interface (`src/components/Admin/PhotoManager.tsx`)

## 🚀 Quick Integration Guide

### Adding Photo Upload to Admin Panel

1. Import the PhotoManager component in `Admin.tsx`:
```typescript
import PhotoManager from '../components/Admin/PhotoManager';
```

2. Add a new tab in the admin panel:
```typescript
const [activeMainTab, setActiveMainTab] = useState<string>('events');

const mainTabs = [
  { id: 'events', name: 'Events' },
  { id: 'pages', name: 'Page Content' },
  { id: 'photos', name: 'Photo Gallery' },  // NEW
  { id: 'timeline', name: 'Timeline' },     // NEW
  { id: 'quiz', name: 'Quiz' },             // NEW
  { id: 'dreams', name: 'Dreams' },         // NEW
  { id: 'reasons', name: 'Reasons' },       // NEW
];
```

3. Render the PhotoManager when photos tab is active:
```typescript
{activeMainTab === 'photos' && (
  <Section>
    <SectionTitle>Photo Gallery Manager</SectionTitle>
    <PhotoManager />
  </Section>
)}
```

## 📝 Hook Usage Examples

### Timeline Events Manager

```typescript
import { useTimelineEvents } from '../hooks/useTimelineEvents';

function TimelineManager() {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useTimelineEvents();

  const handleAdd = async () => {
    await addEvent({
      date: '2024-12-04',
      title: 'First Date',
      description: 'Where it all began...',
      emoji: '💕',
    });
  };

  const handleUpdate = async (id: string) => {
    await updateEvent(id, {
      description: 'Updated description'
    });
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
  };

  return (
    // Your UI here
  );
}
```

### Quiz Questions Manager

```typescript
import { useQuizQuestions } from '../hooks/useQuizQuestions';

function QuizManager() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuizQuestions();

  const handleAdd = async () => {
    await addQuestion({
      question: 'Where did we first meet?',
      options: ['Coffee shop', 'Library', 'Park', 'Online'],
      correctAnswer: 0, // Index of correct option
    });
  };

  return (
    // Your UI here
  );
}
```

### Dreams Manager

```typescript
import { useDreams } from '../hooks/useDreams';

function DreamsManager() {
  const { dreams, addDream, updateDream, deleteDream } = useDreams();

  const handleAdd = async () => {
    await addDream({
      title: 'Travel the World',
      description: 'Visit 50 countries together',
      icon: '🌍',
    });
  };

  return (
    // Your UI here
  );
}
```

### Reasons Grid Manager

```typescript
import { useReasons } from '../hooks/useReasons';

function ReasonsManager() {
  const { reasons, addReason, updateReason, deleteReason } = useReasons();

  const handleAdd = async () => {
    await addReason({
      text: 'Your beautiful smile',
    });
  };

  return (
    // Your UI here
  );
}
```

### Photo Upload

```typescript
import { usePhotos } from '../hooks/usePhotos';

function PhotoUploader() {
  const { photos, uploading, uploadPhoto, deletePhoto } = usePhotos();

  const handleUpload = async (file: File) => {
    await uploadPhoto(file, 'Optional caption');
  };

  const handleDelete = async (id: string, url: string) => {
    await deletePhoto(id, url);
  };

  return (
    // Your UI here - or use PhotoManager component
  );
}
```

## 🔧 Connecting Pages to Firestore

### Update Timeline Page

In `src/pages/Timeline.tsx`, replace hardcoded events with Firestore data:

```typescript
import { useTimelineEvents } from '../hooks/useTimelineEvents';

export default function Timeline() {
  const { events, loading } = useTimelineEvents();

  // Use events from Firestore instead of hardcoded array
  if (loading) return <div>Loading...</div>;

  return (
    // Render events
  );
}
```

### Update Quiz Page

```typescript
import { useQuizQuestions } from '../hooks/useQuizQuestions';

export default function Quiz() {
  const { questions, loading } = useQuizQuestions();
  // Use questions from Firestore
}
```

### Update Dreams Page

```typescript
import { useDreams } from '../hooks/useDreams';

export default function Dreams() {
  const { dreams, loading } = useDreams();
  // Use dreams from Firestore
}
```

### Update Reasons Grid (Home Page)

```typescript
import { useReasons } from '../hooks/useReasons';

export default function Home() {
  const { reasons, loading } = useReasons();
  // Use reasons from Firestore in ReasonsGrid component
}
```

### Update Photo Gallery

```typescript
import { usePhotos } from '../hooks/usePhotos';

export default function PhotoGallery() {
  const { photos, loading } = usePhotos();
  // Use photos from Firestore
}
```

## 📦 Firestore Collections

The hooks automatically create these Firestore collections:

- `events` - Countdown events
- `timelineEvents` - Timeline milestones
- `quizQuestions` - Quiz questions
- `dreams` - Future dreams/goals
- `reasons` - Reasons I love you
- `photos` - Photo gallery metadata
- `pageContent` - Editable page content (letter, home, etc.)

## 🎨 Styled Components Reference

You can reuse the existing styled components from Admin.tsx:

- `InfoCard` - Card container
- `FormGroup` - Form field wrapper
- `FormLabel` - Field labels
- `FormInput` - Text inputs
- `FormTextarea` - Textarea inputs
- `SubmitButton` - Primary action button
- `CancelButton` - Secondary action button
- `DeleteButton` - Delete button
- `ButtonGroup` - Button container
- `EventCard` - Event display card
- `EventsGrid` - Grid layout

## 🚀 Deployment Checklist

Before deploying with the new admin features:

1. ✅ All hooks created
2. ✅ PhotoManager component created
3. ⏳ Add tabs to Admin.tsx for each content type
4. ⏳ Create manager components for each content type (or use inline forms)
5. ⏳ Update pages to use Firestore data instead of hardcoded content
6. ✅ Test locally with Firebase emulators (optional)
7. ✅ Deploy to Vercel with Firebase environment variables

## 💡 Next Steps

1. **Add Photo Tab** - Integrate PhotoManager component
2. **Add Timeline Tab** - Create UI for managing timeline events
3. **Add Quiz Tab** - Create UI for managing quiz questions
4. **Add Dreams Tab** - Create UI for managing dreams
5. **Add Reasons Tab** - Create UI for managing reasons grid
6. **Update Pages** - Connect all pages to Firestore data

## 📚 Example: Complete Timeline Manager

Here's a complete example you can add to Admin.tsx:

```typescript
// In your imports
import { useTimelineEvents } from '../hooks/useTimelineEvents';

// In your component state
const { events: timelineEvents, addEvent: addTimelineEvent,
        updateEvent: updateTimelineEvent, deleteEvent: deleteTimelineEvent } = useTimelineEvents();
const [timelineFormData, setTimelineFormData] = useState({
  date: '',
  title: '',
  description: '',
  emoji: '💕'
});

// Handler function
const handleAddTimelineEvent = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await addTimelineEvent(timelineFormData);
    setTimelineFormData({ date: '', title: '', description: '', emoji: '💕' });
    alert('Timeline event added!');
  } catch (err) {
    alert('Failed to add timeline event');
  }
};

// In your JSX
{activeMainTab === 'timeline' && (
  <Section>
    <SectionTitle>Timeline Events</SectionTitle>
    <InfoCard>
      <form onSubmit={handleAddTimelineEvent}>
        <FormGroup>
          <FormLabel>Date</FormLabel>
          <FormInput
            type="date"
            value={timelineFormData.date}
            onChange={(e) => setTimelineFormData({...timelineFormData, date: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Title</FormLabel>
          <FormInput
            value={timelineFormData.title}
            onChange={(e) => setTimelineFormData({...timelineFormData, title: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Description</FormLabel>
          <FormTextarea
            value={timelineFormData.description}
            onChange={(e) => setTimelineFormData({...timelineFormData, description: e.target.value})}
          />
        </FormGroup>
        <SubmitButton type="submit">Add Event</SubmitButton>
      </form>
    </InfoCard>

    <EventsGrid>
      {timelineEvents.map((event) => (
        <EventCard key={event.id}>
          <h4>{event.title}</h4>
          <p>{event.date}</p>
          <p>{event.description}</p>
          <DeleteButton onClick={() => deleteTimelineEvent(event.id!)}>
            Delete
          </DeleteButton>
        </EventCard>
      ))}
    </EventsGrid>
  </Section>
)}
```

## 🎯 Summary

You now have:
- ✅ All data management hooks ready to use
- ✅ PhotoManager component for image uploads
- ✅ Firebase Storage integration for photos
- ✅ Firestore integration for all content types
- ✅ Type-safe TypeScript interfaces
- ✅ Complete CRUD operations for all content

All the infrastructure is in place! You just need to add the UI components to the Admin panel by following the examples above.
