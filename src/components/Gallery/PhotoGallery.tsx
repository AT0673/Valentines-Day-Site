import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const GallerySection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.h2};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const Description = styled.p`
  text-align: center;
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto ${theme.spacing['2xl']};
  line-height: ${theme.typography.lineHeights.loose};
`;

const MasonryGrid = styled.div`
  column-count: 3;
  column-gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    column-count: 2;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    column-count: 1;
  }
`;

const PhotoCard = styled(motion.div)`
  break-inside: avoid;
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${theme.shadows.soft};
  cursor: pointer;
  transition: all 0.3s ${theme.animations.easings.easeOut};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PhotoCaption = styled.div`
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.typography.fonts.body};
`;

// Placeholder data - will be replaced with Firebase data
const placeholderPhotos = [
  { id: '1', url: 'https://via.placeholder.com/400x300/FFD6E8/FF6B9D?text=Photo+1', caption: 'A beautiful memory together' },
  { id: '2', url: 'https://via.placeholder.com/400x500/E8D6FF/C8B6E2?text=Photo+2', caption: 'Special moment' },
  { id: '3', url: 'https://via.placeholder.com/400x400/FFE5D9/FFB6C1?text=Photo+3', caption: 'Our adventure' },
  { id: '4', url: 'https://via.placeholder.com/400x350/FFF8F0/FF6B9D?text=Photo+4', caption: 'Smiling together' },
  { id: '5', url: 'https://via.placeholder.com/400x450/FFD6E8/C8B6E2?text=Photo+5', caption: 'Love captured' },
  { id: '6', url: 'https://via.placeholder.com/400x380/E8D6FF/FF6B9D?text=Photo+6', caption: 'Forever moments' },
];

export default function PhotoGallery() {
  return (
    <GallerySection>
      <div className="container">
        <SectionTitle>Judy Jiao Collection</SectionTitle>
        <Description>
          Every photo tells a story of our journey together. These moments captured in time
          remind me of all the reasons I love you.
        </Description>

        <MasonryGrid>
          {placeholderPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <PhotoImage src={photo.url} alt={photo.caption} loading="lazy" />
              <PhotoCaption>{photo.caption}</PhotoCaption>
            </PhotoCard>
          ))}
        </MasonryGrid>
      </div>
    </GallerySection>
  );
}
