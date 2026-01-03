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

export interface Reason {
  id?: string;
  text: string;
  order?: number;
}

export function useReasons() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReasons = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'reasons'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedReasons: Reason[] = [];

      querySnapshot.forEach((doc) => {
        fetchedReasons.push({
          id: doc.id,
          ...doc.data(),
        } as Reason);
      });

      setReasons(fetchedReasons);
    } catch (err) {
      console.error('Error fetching reasons:', err);
      setError('Failed to fetch reasons');
    } finally {
      setLoading(false);
    }
  };

  const addReason = async (reason: Reason) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = await addDoc(collection(db, 'reasons'), {
        ...reason,
        order: reasons.length,
      });
      await fetchReasons();
      return docRef.id;
    } catch (err) {
      console.error('Error adding reason:', err);
      throw err;
    }
  };

  const updateReason = async (id: string, reason: Partial<Reason>) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'reasons', id);
      await updateDoc(docRef, reason);
      await fetchReasons();
    } catch (err) {
      console.error('Error updating reason:', err);
      throw err;
    }
  };

  const deleteReason = async (id: string) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'reasons', id);
      await deleteDoc(docRef);
      await fetchReasons();
    } catch (err) {
      console.error('Error deleting reason:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  return {
    reasons,
    loading,
    error,
    addReason,
    updateReason,
    deleteReason,
    refetch: fetchReasons,
  };
}
