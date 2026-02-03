import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Wish } from '../types/firestore';

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'wishes'),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        })) as Wish[];
        setWishes(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to wishes:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addWish = async (text: string, position: { x: number; y: number }): Promise<string | null> => {
    if (!db || !isFirebaseConfigured) return null;

    try {
      const docRef = await addDoc(collection(db, 'wishes'), {
        text,
        position,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding wish:', error);
      return null;
    }
  };

  return { wishes, loading, addWish };
}
