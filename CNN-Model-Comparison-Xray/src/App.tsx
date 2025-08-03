import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import AboutProjectPage from './pages/AboutProjectPage';
import ContactUsPage from './pages/ContactUsPage';
import RDTeamPage from './pages/RDTeamPage';
import AnalysisPage from './pages/AnalysisPage';
import MaintenancePage from './pages/MaintenancePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about-project" element={<AboutProjectPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/rd-team" element={<RDTeamPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/maintenance-system" element={<MaintenancePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
