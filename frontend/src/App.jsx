import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Favicon Logic
  useEffect(() => {
    axios.get('http://localhost:5000/api/profile')
      .then(res => {
        if (res.data && res.data.profile_image_url) {
          const faviconUrl = res.data.profile_image_url.startsWith('http') 
            ? res.data.profile_image_url 
            : `http://localhost:5000${res.data.profile_image_url}`;
          
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret Shortcut: Ctrl + Alt + L (or Cmd + Option + L on Mac)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        navigate('/login');
        window.scrollTo(0, 0); // Ensure page jumps to the top on login navigation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener on component unmount to prevent memory leaks
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Conditionally hide the footer on the login page for a distraction-free UI */}
      {location.pathname !== '/login' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;