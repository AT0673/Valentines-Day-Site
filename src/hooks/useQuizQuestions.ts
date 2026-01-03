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

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order?: number;
}

export function useQuizQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'quizQuestions'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedQuestions: QuizQuestion[] = [];

      querySnapshot.forEach((doc) => {
        fetchedQuestions.push({
          id: doc.id,
          ...doc.data(),
        } as QuizQuestion);
      });

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      setError('Failed to fetch quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (question: QuizQuestion) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = await addDoc(collection(db, 'quizQuestions'), {
        ...question,
        order: questions.length,
      });
      await fetchQuestions();
      return docRef.id;
    } catch (err) {
      console.error('Error adding quiz question:', err);
      throw err;
    }
  };

  const updateQuestion = async (id: string, question: Partial<QuizQuestion>) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'quizQuestions', id);
      await updateDoc(docRef, question);
      await fetchQuestions();
    } catch (err) {
      console.error('Error updating quiz question:', err);
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!db || !isFirebaseConfigured) return;

    try {
      const docRef = doc(db, 'quizQuestions', id);
      await deleteDoc(docRef);
      await fetchQuestions();
    } catch (err) {
      console.error('Error deleting quiz question:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchQuestions,
  };
}
