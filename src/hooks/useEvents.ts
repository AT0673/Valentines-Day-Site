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

export interface CountdownEvent {
  id?: string;
  name: string;
  date: string; // ISO string format
  description?: string;
  createdAt?: Date;
}

export function useEvents() {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = async () => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents: CountdownEvent[] = [];

      querySnapshot.forEach((doc) => {
        fetchedEvents.push({
          id: doc.id,
          ...doc.data(),
        } as CountdownEvent);
      });

      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const addEvent = async (event: CountdownEvent) => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: new Date(),
      });
      setEvents([...events, { ...event, id: docRef.id }]);
      setError(null);
      return docRef.id;
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event');
    }
  };

  // Update event
  const updateEvent = async (id: string, event: Partial<CountdownEvent>) => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      return;
    }

    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, event);
      setEvents(
        events.map((e) => (e.id === id ? { ...e, ...event } : e))
      );
      setError(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      return;
    }

    try {
      const docRef = doc(db, 'events', id);
      await deleteDoc(docRef);
      setEvents(events.filter((e) => e.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
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
