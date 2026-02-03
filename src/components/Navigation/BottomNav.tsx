import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const NavContainer = styled(motion.nav)<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: ${theme.zIndex.nav};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;

  /* Glass morphism effect */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${theme.shadows.glass};

  transition: transform 0.3s ${theme.animations.easings.easeOut};

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 16px;
    padding: 8px 16px;
    gap: 4px;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  font-weight: ${theme.typography.weights.medium};
  transition: all 0.3s ${theme.animations.easings.easeOut};
  position: relative;

  &:hover {
    color: ${theme.colors.primary};
    transform: scale(1.05);
    background: rgba(255, 107, 157, 0.1);
  }

  &.active {
    color: ${theme.colors.primary};
    background: rgba(255, 107, 157, 0.15);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6px 8px;
    font-size: 11px;
  }
`;

const IconWrapper = styled.div`
  font-size: 20px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const Label = styled.span`
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 10px;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${theme.colors.primary};
`;

interface NavItemData {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItemData[] = [
  { path: '/home', label: 'Home', icon: '💕' },
  { path: '/countdown', label: 'Countdown', icon: '⏰' },
  { path: '/timeline', label: 'Timeline', icon: '📖' },
  { path: '/letter', label: 'Letter', icon: '💌' },
  { path: '/dreams', label: 'Dreams', icon: '✨' },
  { path: '/quiz', label: 'Quiz', icon: '❓' },
  { path: '/wishes', label: 'Wishes', icon: '⭐' },
];

export default function BottomNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Hide nav on landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  if (isLandingPage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <NavContainer
          $isVisible={isVisible}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <IconWrapper>{item.icon}</IconWrapper>
              <Label>{item.label}</Label>
              {location.pathname === item.path && (
                <ActiveIndicator
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              )}
            </NavItem>
          ))}
        </NavContainer>
      )}
    </AnimatePresence>
  );
}
