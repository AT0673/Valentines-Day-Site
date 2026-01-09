import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

export interface TimelineEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  emoji?: string;
  order?: number;
}

export function useTimelineEvents() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'timelineEvents'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents: TimelineEvent[] = [];

      querySnapshot.forEach((doc) => {
        fetchedEvents.push({
          id: doc.id,
          ...doc.data(),
        } as TimelineEvent);
      });

      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error fetching timeline events:', err);
      setError('Failed to fetch timeline events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: TimelineEvent) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = await addDoc(collection(db, 'timelineEvents'), {
        ...event,
        order: events.length,
      });
      await fetchEvents();
      return docRef.id;
    } catch (err) {
      console.error('Error adding timeline event:', err);
      throw err;
    }
  };

  const updateEvent = async (id: string, event: Partial<TimelineEvent>) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'timelineEvents', id);
      await updateDoc(docRef, event);
      await fetchEvents();
    } catch (err) {
      console.error('Error updating timeline event:', err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'timelineEvents', id);
      await deleteDoc(docRef);
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting timeline event:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
