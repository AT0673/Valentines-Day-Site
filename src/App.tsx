import { BrowserRouter, useRoutes, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
import CustomCursor from './components/Effects/CustomCursor';
import MobileTouchEffects from './components/Effects/MobileTouchEffects';
import './styles/global.css';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const routes = useRoutes([
    { path: '/', element: <Landing /> },
    { path: '/home', element: <Home /> },
    { path: '/countdown', element: <Countdown /> },
    { path: '/timeline', element: <Timeline /> },
    { path: '/letter', element: <Letter /> },
    { path: '/dreams', element: <Dreams /> },
    { path: '/quiz', element: <Quiz /> },
    { path: '/wishes', element: <Wishes /> },
    { path: '/admin', element: <Admin /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return (
    <>
      {routes}
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
