import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/settings')
      .then(res => setSettings(res.data))
      .catch(console.error);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-900/80 backdrop-blur-md border-t border-white/10 pt-16 pb-6 z-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          
          {/* Column 1: Brand / About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
              Kasun Chathuranga
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {settings?.tagline || 'Building modern digital experiences with passion and precision.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-center md:text-left">
              {['Home', 'Experience', 'Education', 'Certifications', 'Skills', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                    onClick={(e) => {
                      if (item === 'Home') {
                        e.preventDefault();
                        if (location.pathname !== '/') window.location.href = '/';
                        else window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        handleAnchorClick(e, item.toLowerCase());
                      }
                    }}
                    className="inline-block text-slate-400 hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-white mb-6">Connect</h3>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              
              {/* Facebook */}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}

              {/* LinkedIn */}
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,119,181,0.5)] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
              
              {/* GitHub */}
              {settings?.github_url && (
                <a href={settings.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#333] hover:text-white hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              )}

              {/* WhatsApp */}
              {settings?.whatsapp_url && (
                <a href={settings.whatsapp_url} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
              )}

              {/* Fiverr */}
              {settings?.fiverr_url && (
                <a href={settings.fiverr_url} target="_blank" rel="noreferrer" aria-label="Fiverr" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1dbf73] hover:text-white hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(29,191,115,0.5)] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M85 76c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5zM22.4 34.6h-7.8v43h13.2V52.8c0-5 3.3-6.6 6.3-6.6 1.4 0 2.6.2 3.6.4v-12c-1-.2-2.3-.4-3.7-.4-4.8 0-8.8 2.7-11.6 7v-6.6zm39.1 16v-6.7c-2.4-1.2-5.7-1.9-9.1-1.9-8.7 0-14 5.3-14 13.9s5.6 14.2 13.7 14.2c4.1 0 7.8-1 10.4-2.8v-7.9c-2.3 1.4-5.3 2.1-8.3 2.1-4 0-6.7-1.9-6.7-5.9h14.7v-1.1c0-1-.1-2.4-.7-3.9zm-13.8-3.4c.5-2.2 2.6-3.8 5-3.8 2.5 0 4.6 1.7 5 4v1h-10v-1.2zm23.6-12.6h-13.2v43h13.2v-43zm-6.6-15.6c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
                  </svg>
                </a>
              )}

            </div>
          </div>
        </div>

        {/* Bottom Bar & Utilities */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Kasun Chathuranga. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 transition-all duration-300 group shadow-lg"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform duration-300">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;