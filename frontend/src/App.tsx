import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import { LoginPage } from './pages/Auth/LoginPage';
import { MentorDashboard } from './pages/Mentor/MentorDashboard';
import { ResearcherDashboard } from './pages/Researcher/ResearcherDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ResearcherConnectPage } from './pages/Researcher/ConnectPage';
import { MentorConnectPage } from './pages/Mentor/ConnectPage';

// New Researcher Pages
import { CheckPaperPage } from './pages/Researcher/CheckPaperPage';
import { VideoAnalysisPage } from './pages/Researcher/VideoAnalysisPage';
import { OnlineMeetingPage } from './pages/Researcher/OnlineMeetingPage';

import { VeritasChatbot } from './VeritasChatbot';

/* ─────────────────────────────────────
   App Layout (Chatbot lives here)
───────────────────────────────────── */
function AppLayout() {
  return (
    <>
      <Outlet />
      <VeritasChatbot />
    </>
  );
}

/* ─────────────────────────────────────
   Main App Component
───────────────────────────────────── */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* ───── Public Routes (NO Chatbot) ───── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ───── Protected / App Routes ───── */}
          <Route element={<AppLayout />}>
            {/* Mentor Routes */}
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/connect" element={<MentorConnectPage />} />
            
            {/* Researcher Routes */}
            <Route path="/researcher" element={<ResearcherDashboard />} />
            <Route path="/researcher/connect" element={<ResearcherConnectPage />} />
            <Route path="/researcher/check-paper" element={<CheckPaperPage />} />
            <Route path="/researcher/video-analysis" element={<VideoAnalysisPage />} />
            <Route path="/researcher/online-meeting" element={<OnlineMeetingPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Shared Routes */}
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* ───── Root Redirect ───── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;