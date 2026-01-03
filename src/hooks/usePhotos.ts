import { useState, useEffect } from 'react';
import { db, storage, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

export interface Photo {
  id?: string;
  url: string;
  caption?: string;
  order?: number;
  uploadedAt?: Date;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'photos'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedPhotos: Photo[] = [];

      querySnapshot.forEach((doc) => {
        fetchedPhotos.push({
          id: doc.id,
          ...doc.data(),
        } as Photo);
      });

      setPhotos(fetchedPhotos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, caption?: string) => {
    if (!db || !storage || !isFirebaseConfigured) return;

    try {
      setUploading(true);

      // Upload file to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(storage, `photos/${timestamp}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // Save photo metadata to Firestore
      const docRef = await addDoc(collection(db, 'photos'), {
        url,
        caption: caption || '',
        order: photos.length,
        uploadedAt: new Date(),
      });

      await fetchPhotos();
      return docRef.id;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id: string, url: string) => {
    if (!db || !storage || !isFirebaseConfigured) return;

    try {
      // Delete from Firestore
      const docRef = doc(db, 'photos', id);
      await deleteDoc(docRef);

      // Delete from Storage
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (storageErr) {
        console.warn('Could not delete from storage:', storageErr);
      }

      await fetchPhotos();
    } catch (err) {
      console.error('Error deleting photo:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    loading,
    uploading,
    error,
    uploadPhoto,
    deletePhoto,
    refetch: fetchPhotos,
  };
}
