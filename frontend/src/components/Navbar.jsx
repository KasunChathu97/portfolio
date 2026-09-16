import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Theme Toggle Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (isAdminRoute) {
      axios.get('http://localhost:5000/api/messages')
        .then(res => {
          const count = res.data.filter(m => !m.is_read).length;
          setUnreadCount(count);
        })
        .catch(console.error);
        
      axios.get('http://localhost:5000/api/settings')
        .then(res => {
          if(res.data && res.data.visitor_count !== undefined) {
             setVisitorCount(res.data.visitor_count);
          }
        })
        .catch(console.error);
    }
  }, [isAdminRoute]);

  const handleScrollToTop = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all">
      <div className="container mx-auto px-4 max-w-7xl h-20 flex justify-between items-center">
        <a href="/" onClick={handleScrollToTop} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer outline-none">
          Kasun Chathuranga
        </a>

        {isAdminRoute ? (
          <div className="flex items-center gap-2 md:gap-6">
            <span className="hidden md:block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-extrabold text-lg tracking-wide uppercase">
              Admin CMS <span className="text-sm font-medium text-slate-400 normal-case tracking-normal ml-2">Portfolio Manager v1.0</span>
            </span>

            <div className="flex items-center gap-3 md:gap-4 border-l border-white/10 pl-3 md:pl-6 ml-1 md:ml-2">
              {/* Visitor Counter Badge */}
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full shadow-inner hover:bg-slate-700/80 transition cursor-default">
                <span className="text-emerald-400 text-sm">👁️</span>
                <span className="text-sm font-bold text-slate-200">{visitorCount} <span className="hidden sm:inline text-xs text-slate-400 font-medium">Visits</span></span>
              </div>
              
              {/* Notification Bell */}
              <a href="/admin#messages" className="relative text-slate-300 hover:text-emerald-400 transition-colors bg-slate-800/80 border border-slate-700 p-2 rounded-full shadow-inner hover:bg-slate-700/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        ) : (
          <div className="space-x-8 hidden md:flex items-center font-medium">
            <a href="#experience" onClick={(e) => handleAnchorClick(e, 'experience')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Experience</a>
            <a href="#education" onClick={(e) => handleAnchorClick(e, 'education')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Education</a>
            <a href="#certifications" onClick={(e) => handleAnchorClick(e, 'certifications')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Certifications</a>
            <a href="#skills" onClick={(e) => handleAnchorClick(e, 'skills')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Skills</a>
            <a href="#projects" onClick={(e) => handleAnchorClick(e, 'projects')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Projects</a>
            <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Contact</a>
            
            {/* Theme Toggle Button 
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 transition-colors text-emerald-400 border border-slate-700 shadow-inner"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                // Sun Icon (Switch to Light)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path><path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path><path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              ) : (
                // Moon Icon (Switch to Dark)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
            </button>*/}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;