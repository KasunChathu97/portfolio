import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

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
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="container mx-auto px-4 max-w-7xl h-20 flex justify-between items-center">
        <a href="/" onClick={handleScrollToTop} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer outline-none">
          Kasun Chathuranga
        </a>
        <div className="space-x-8 hidden md:flex items-center font-medium">
          <a href="#experience" onClick={(e) => handleAnchorClick(e, 'experience')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Experience</a>
          <a href="#education" onClick={(e) => handleAnchorClick(e, 'education')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Education</a>
          <a href="#certifications" onClick={(e) => handleAnchorClick(e, 'certifications')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Certifications</a>
          <a href="#skills" onClick={(e) => handleAnchorClick(e, 'skills')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Skills</a>
          <a href="#projects" onClick={(e) => handleAnchorClick(e, 'projects')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Projects</a>
          <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="hover:text-emerald-400 transition-colors cursor-pointer text-sm tracking-wide">Contact</a>
          <Link to="/admin" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5">
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;