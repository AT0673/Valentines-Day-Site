import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

export interface PageContent {
  title?: string;
  subtitle?: string;
  message?: string;
  content?: string;
  [key: string]: any;
}

export function usePageContent(pageId: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch page content
  const fetchContent = async () => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, 'pages', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as PageContent);
      } else {
        setContent(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching page content:', err);
      setError('Failed to fetch page content');
    } finally {
      setLoading(false);
    }
  };

  // Update page content
  const updateContent = async (newContent: PageContent) => {
    if (!db || !isFirebaseConfigured) {
      setError('Firebase is not configured');
      return;
    }

    try {
      const docRef = doc(db, 'pages', pageId);
      await setDoc(docRef, newContent, { merge: true });
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating page content:', err);
      setError('Failed to update page content');
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
  }, [pageId]);

  return {
    content,
    loading,
    error,
    updateContent,
    refetch: fetchContent,
  };
}
