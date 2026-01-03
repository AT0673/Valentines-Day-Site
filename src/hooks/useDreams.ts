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

export interface Dream {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDreams = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'dreams'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedDreams: Dream[] = [];

      querySnapshot.forEach((doc) => {
        fetchedDreams.push({
          id: doc.id,
          ...doc.data(),
        } as Dream);
      });

      setDreams(fetchedDreams);
    } catch (err) {
      console.error('Error fetching dreams:', err);
      setError('Failed to fetch dreams');
    } finally {
      setLoading(false);
    }
  };

  const addDream = async (dream: Dream) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = await addDoc(collection(db, 'dreams'), {
        ...dream,
        order: dreams.length,
      });
      await fetchDreams();
      return docRef.id;
    } catch (err) {
      console.error('Error adding dream:', err);
      throw err;
    }
  };

  const updateDream = async (id: string, dream: Partial<Dream>) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'dreams', id);
      await updateDoc(docRef, dream);
      await fetchDreams();
    } catch (err) {
      console.error('Error updating dream:', err);
      throw err;
    }
  };

  const deleteDream = async (id: string) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'dreams', id);
      await deleteDoc(docRef);
      await fetchDreams();
    } catch (err) {
      console.error('Error deleting dream:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  return {
    dreams,
    loading,
    error,
    addDream,
    updateDream,
    deleteDream,
    refetch: fetchDreams,
  };
}
