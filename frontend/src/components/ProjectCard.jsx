import { useState, useEffect } from 'react';

function ProjectCard({ project }) {
  // Ensure we can handle tech_stack if it exists, splitting by comma
  const techStackList = project.tech_stack ? project.tech_stack.split(',').map(tech => tech.trim()) : [];

  // Parse image_urls
  let images = [];
  try {
    const parsed = JSON.parse(project.image_urls);
    if (Array.isArray(parsed)) images = parsed;
    else if (project.image_urls) images = [project.image_urls];
  } catch(e) {
    if (project.image_urls) images = [project.image_urls];
  }
  if (images.length === 0) images = ['https://placehold.co/600x400/1e293b/94a3b8?text=Project+Image'];

  // Hover Slideshow State
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let intervalId;
    if (isHovered && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 1500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, images.length]);

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.2)] hover:border-emerald-500/30 transition-all duration-300 group">
      {/* Top of Card: Image Container with Slideshow */}
      <div 
        className="relative w-full h-56 overflow-hidden bg-slate-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
      >
        {images.map((img, idx) => {
          const src = img.startsWith('http') ? img : `http://localhost:5000${img}`;
          return (
            <img 
              key={idx}
              src={src} 
              alt={`${project.title} - ${idx}`} 
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=No+Image';
              }}
            />
          );
        })}
        {/* Optional overlay gradient to blend image into card */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-20 pointer-events-none"></div>
      </div>
      
      {/* Middle of Card */}
      <div className="px-6 pt-4 pb-6 flex flex-col flex-grow relative z-10">
        {/* Right-Aligned Subtle Colored Project Type Badge */}
        <div className={`ml-auto px-3 py-1 rounded-full border text-xs font-medium mb-1.5 ${
          project.project_type === 'Group' 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        }`}>
          {project.project_type || 'Solo'}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">{project.title}</h3>
        
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStackList.map((tech, idx) => (
            <span key={idx} className="text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
              {tech}
            </span>
          ))}
        </div>

        <p className="text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>
        
        {/* Bottom/Action Area */}
        <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-5">
          {project.github_link && (
            <a 
              href={project.github_link} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl transition-colors font-bold text-sm"
            >
              View Code
            </a>
          )}
          {project.live_link && (
            <a 
              href={project.live_link} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 text-center bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-sm"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProjectCard;