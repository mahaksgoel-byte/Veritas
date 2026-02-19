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
            
            {/* Researcher Routes */}
            <Route path="/researcher" element={<ResearcherDashboard />} />
            
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