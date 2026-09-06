function ProjectCard({ project }) {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/20 transition duration-300">
      <img 
        src={project.image_url || 'https://via.placeholder.com/400x250'} 
        alt={project.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-slate-400 mb-4">{project.description}</p>
        
        <div className="text-emerald-400 font-semibold mb-6 text-sm">
          Tech Stack: {project.tech_stack}
        </div>
        
        <a 
          href={project.project_link || '#'} 
          target="_blank" 
          rel="noreferrer"
          className="inline-block border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 px-4 py-2 rounded transition font-bold"
        >
          View Project
        </a>
      </div>
    </div>
  );
}
export default ProjectCard;