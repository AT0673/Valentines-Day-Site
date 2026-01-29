import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Countdown from './pages/Countdown';
import Timeline from './pages/Timeline';
import Letter from './pages/Letter';
import Dreams from './pages/Dreams';
import Quiz from './pages/Quiz';
import Wishes from './pages/Wishes';
import Admin from './pages/Admin';
import BottomNav from './components/Navigation/BottomNav';
import PageTransition from './components/Transitions/PageTransition';
import CustomCursor from './components/Effects/CustomCursor';
import MobileTouchEffects from './components/Effects/MobileTouchEffects';
import './styles/global.css';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <CustomCursor />
      <MobileTouchEffects />
      <PageTransition location={location.pathname}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/dreams" element={<Dreams />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
