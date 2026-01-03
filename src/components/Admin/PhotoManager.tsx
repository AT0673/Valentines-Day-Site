import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { usePhotos } from '../../hooks/usePhotos';

const Container = styled.div``;

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

const UploadText = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
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

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: rgba(255, 59, 48, 0.9);
  border: none;
  color: white;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function PhotoManager() {
  const { photos, loading, uploading, uploadPhoto, deletePhoto } = usePhotos();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await deletePhoto(id, url);
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  return (
    <Container>
      <UploadZone
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <UploadText>
          {uploading ? '📤 Uploading...' : '📸 Click or drag photos here to upload'}
        </UploadText>
        <UploadText style={{ fontSize: '14px' }}>
          Supports JPG, PNG, GIF
        </UploadText>
      </UploadZone>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />

      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <PhotoGrid>
          <AnimatePresence>
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <PhotoImage src={photo.url} alt={photo.caption || 'Photo'} />
                <DeleteButton
                  onClick={() => handleDelete(photo.id!, photo.url)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </DeleteButton>
              </PhotoCard>
            ))}
          </AnimatePresence>
        </PhotoGrid>
      )}
    </Container>
  );
}
