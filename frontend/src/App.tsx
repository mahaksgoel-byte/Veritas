import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignUpPage';

import { AcademiaDashboard } from './pages/Academia/AcademiaDashboard';
import { ResearchDashboard } from './pages/Research/ResearchDashboard';
import { AboutPage } from './pages/AboutPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ReviewsPage } from './pages/ReviewsPage';

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
          <Route path="/signup" element={<SignupPage />} />

          {/* ───── Protected / App Routes ───── */}
          <Route element={<AppLayout />}>
            {/* Academia Routes */}
            <Route path="/academia" element={<AcademiaDashboard />} />
            
            {/* Research Routes */}
            <Route path="/research" element={<ResearchDashboard />} />
            
            {/* Shared Routes */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Route>

          {/* ───── Root Redirect ───── */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ───── Catch All ───── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;