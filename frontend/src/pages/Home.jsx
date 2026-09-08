import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const SoftSkillCard = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const targetCount = skill.proficiency_percentage || 0;

  const colorClasses = [
    { text: 'text-cyan-400', border: 'border-cyan-500/10', hoverBorder: 'hover:border-cyan-500/30', shadow: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]', cardShadow: 'hover:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.3)]' },
    { text: 'text-indigo-400', border: 'border-indigo-500/10', hoverBorder: 'hover:border-indigo-500/30', shadow: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]', cardShadow: 'hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.3)]' },
    { text: 'text-emerald-400', border: 'border-emerald-500/10', hoverBorder: 'hover:border-emerald-500/30', shadow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]', cardShadow: 'hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)]' },
    { text: 'text-rose-400', border: 'border-rose-500/10', hoverBorder: 'hover:border-rose-500/30', shadow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]', cardShadow: 'hover:shadow-[0_10px_20px_-10px_rgba(244,63,94,0.3)]' },
    { text: 'text-violet-400', border: 'border-violet-500/10', hoverBorder: 'hover:border-violet-500/30', shadow: 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]', cardShadow: 'hover:shadow-[0_10px_20px_-10px_rgba(139,92,246,0.3)]' },
  ];
  const color = colorClasses[index % colorClasses.length];

  useEffect(() => {
    let interval;
    if (isHovered) {
      setCurrentCount(0);
      interval = setInterval(() => {
        setCurrentCount(prev => {
          if (prev >= targetCount) {
            clearInterval(interval);
            return targetCount;
          }
          return prev + 1;
        });
      }, 10);
    } else {
      setCurrentCount(targetCount);
    }
    return () => clearInterval(interval);
  }, [isHovered, targetCount]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentCount / 100) * circumference;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border ${color.border} ${color.hoverBorder} hover:-translate-y-1 ${color.cardShadow} transition-all duration-300 cursor-default h-full w-full`}
    >
       <div className="relative w-24 h-24 flex items-center justify-center">
         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
           <circle 
             cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" 
             className={`${color.text} ${isHovered ? color.shadow : ''} transition-all duration-75 ease-out`} 
             strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" 
           />
         </svg>
         <span className="absolute text-lg font-bold text-white">{currentCount}%</span>
       </div>
       <span className="mt-4 text-slate-200 font-semibold text-center">{skill.name}</span>
    </div>
  );
};

function Home() {
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message_body: '' });
  const [status, setStatus] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertImage, setSelectedCertImage] = useState(null);

  useEffect(() => {
    // Fetch Data
    axios.get('http://localhost:5000/api/profile').then(res => setProfile(res.data)).catch(console.error);
    axios.get('http://localhost:5000/api/skills').then(res => setSkills(res.data)).catch(console.error);
    axios.get('http://localhost:5000/api/certifications').then(res => setCertifications(res.data)).catch(console.error);
    axios.get('http://localhost:5000/api/projects').then(res => setProjects(res.data)).catch(console.error);
    axios.get('http://localhost:5000/api/experience').then(res => setExperiences(res.data)).catch(console.error);
    axios.get('http://localhost:5000/api/education').then(res => setEducations(res.data)).catch(console.error);
  }, []);

  const handleContactChange = (e) => setContactData({ ...contactData, [e.target.name]: e.target.value });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending...');
    axios.post('http://localhost:5000/api/messages', contactData, {
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {
        setStatus('Message sent successfully!');
        setContactData({ name: '', email: '', subject: '', message_body: '' });
        setTimeout(() => setStatus(''), 5000);
      })
      .catch((error) => {
        console.error("Frontend Form Submit Error:", error.response?.data || error.message);
        setStatus('Error sending message.');
      })
      .finally(() => setIsSubmitting(false));
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const softSkills = skills.filter(s => s.main_category === 'Soft Skills').sort((a, b) => (b.proficiency_percentage || 0) - (a.proficiency_percentage || 0));
  const languageSkills = skills.filter(s => s.main_category === 'Languages');
  const techSkills = skills.filter(s => s.main_category === 'Technical Skills');

  const filteredProjects = projects.filter(p => {
    if (projectFilter === 'All') return true;
    if (projectFilter === 'Solo Projects') return p.project_type === 'Solo' || !p.project_type;
    if (projectFilter === 'Group Projects') return p.project_type === 'Group';
    return true;
  });

  
  const techSkillsGrouped = techSkills.reduce((acc, skill) => {
    const groupName = skill.name || 'Other';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(skill);
    return acc;
  }, {});

  return (
    <div className="w-full font-sans pt-20">
      
      {/* Hero Section */}
      <div id="home" className="scroll-mt-20 relative min-h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden py-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          
          {/* Glowing Circular Avatar */}
          <div className="w-40 h-40 rounded-full border-4 border-emerald-500 shadow-xl shadow-emerald-500/30 mb-8 flex items-center justify-center overflow-hidden bg-slate-800">
            {profile.profile_image_url ? (
              <img src={getImageUrl(profile.profile_image_url)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-center text-sm px-2 font-medium">{profile.full_name}</span>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{profile.full_name}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-emerald-400 mb-6">
            {profile.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-wrap">
            {profile.bio}
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#projects" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-full text-lg hover:from-emerald-400 hover:to-emerald-500 transition shadow-lg shadow-emerald-500/30">
              View My Projects
            </a>
            <a href="#contact" className="px-8 py-3 border border-emerald-500/50 text-emerald-400 font-bold rounded-full text-lg hover:bg-emerald-500/10 transition">
              Contact Me
            </a>
          </div>
        </div>
      </div>



      {/* Working Experience Section */}
      <div id="experience" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Working <span className="text-cyan-400">Experience</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.length > 0 ? experiences.map(exp => {
              const CardContent = (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-full flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                  {exp.company_logo_url ? (
                    <div className="w-24 h-24 mb-6 rounded-2xl bg-white flex items-center justify-center p-2 shadow-inner">
                      <img src={getImageUrl(exp.company_logo_url)} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mb-6 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-slate-500 font-bold text-sm">No Logo</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.position}</h3>
                  <p className="text-cyan-400 font-semibold text-lg mb-4">{exp.company_name}</p>
                  
                  <div className="mt-auto pt-4 w-full border-t border-white/10">
                    <span className="inline-block text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full font-semibold text-sm border border-emerald-500/20">
                      {exp.start_date} {exp.is_current ? '- Present' : (exp.end_date ? `- ${exp.end_date}` : '')}
                    </span>
                  </div>
                </div>
              );

              return exp.company_url ? (
                <a 
                  key={exp.id} 
                  href={exp.company_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full group outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
                >
                  {CardContent}
                </a>
              ) : (
                <div key={exp.id} className="block h-full">
                  {CardContent}
                </div>
              );
            }) : (
              <p className="text-center text-slate-400 col-span-full text-lg">No working experiences added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div id="education" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-emerald-400">Education</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educations.length > 0 ? educations.map(edu => {
              const CardContent = (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-full flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                  {edu.logo_url ? (
                    <div className="w-24 h-24 mb-6 rounded-2xl bg-white flex items-center justify-center p-2 shadow-inner">
                      <img src={getImageUrl(edu.logo_url)} alt="Institution Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mb-6 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-slate-500 font-bold text-sm">No Logo</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{edu.degree_course_name}</h3>
                  <p className="text-cyan-400 font-semibold text-lg mb-4">{edu.institution_name}</p>
                  
                  {edu.description && (
                    <div className="text-slate-300 text-sm mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 leading-relaxed whitespace-pre-wrap w-full text-left">
                      {edu.description}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 w-full border-t border-white/10">
                    <span className="inline-block text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full font-semibold text-sm border border-emerald-500/20">
                      {edu.start_date} {edu.is_current ? '- Present' : (edu.end_date ? `- ${edu.end_date}` : '')}
                    </span>
                  </div>
                </div>
              );

              return edu.institution_url ? (
                <a 
                  key={edu.id} 
                  href={edu.institution_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full group outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
                >
                  {CardContent}
                </a>
              ) : (
                <div key={edu.id} className="block h-full">
                  {CardContent}
                </div>
              );
            }) : (
              <p className="text-center text-slate-400 col-span-full text-lg">No education history added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <div id="certifications" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-cyan-400">Certifications</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map(cert => {
                const link = cert.certificate_image_url ? getImageUrl(cert.certificate_image_url) : (cert.image_url ? getImageUrl(cert.image_url) : null);
                return (
                  <div key={cert.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-full flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                    
                    {cert.certificate_image_url || cert.image_url ? (
                      <div className="w-24 h-24 mb-6 rounded-2xl bg-white flex items-center justify-center p-2 shadow-inner shrink-0">
                        <img src={getImageUrl(cert.certificate_image_url || cert.image_url)} alt="Cert Badge" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 mb-6 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                        <span className="text-slate-500 font-bold text-sm">No Image</span>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                    <p className="text-cyan-400 font-semibold text-lg mb-4">{cert.issuer}</p>

                    <div className="w-full border-t border-white/10 pt-4 mb-6">
                      <span className="inline-block text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full font-semibold text-sm border border-emerald-500/20">
                        Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                      </span>
                    </div>

                    {link ? (
                      <button 
                        onClick={() => { setSelectedCertImage(link); setIsModalOpen(true); }}
                        className="mt-auto w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300"
                      >
                        View Certificate
                      </button>
                    ) : (
                      <div className="mt-auto w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                        No Certificate Available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div id="skills" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-emerald-400">Skills</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="flex flex-col gap-16">
              
              {/* Technical Skills */}
              {Object.keys(techSkillsGrouped).length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-8 text-center">Technical <span className="text-emerald-400">Skills</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(techSkillsGrouped).map(([categoryName, items]) => (
                      <div key={categoryName} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                        <h4 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4 text-center">
                          {categoryName}
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4 mt-auto">
                          {items.map(skill => (
                            <div key={skill.id} className="flex flex-col items-center gap-3 bg-slate-800/30 text-slate-300 border border-slate-700/50 px-4 py-4 rounded-xl text-sm font-semibold hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 min-w-[90px]">
                              {skill.skill_logo_url ? (
                                <img src={getImageUrl(skill.skill_logo_url)} alt={skill.sub_category} className="w-8 h-8 object-contain drop-shadow-md" />
                              ) : (
                                <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-xs">💻</div>
                              )}
                              <span>{skill.sub_category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {softSkills.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-8 text-center">Soft <span className="text-cyan-400">Skills</span></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {softSkills.map((skill, index) => (
                      <SoftSkillCard key={skill.id} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languageSkills.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-8 text-center">Language <span className="text-cyan-400">Skills</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {languageSkills.map(skill => (
                      <div key={skill.id} className="relative overflow-hidden flex items-center justify-between p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group">
                         <div className="flex flex-col z-10 w-full pr-4">
                           <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{skill.name}</span>
                           <div className="h-0.5 bg-cyan-500/50 w-0 group-hover:w-full transition-all duration-500 ease-out mt-1.5 rounded-full"></div>
                         </div>
                         {skill.proficiency_text && (
                           <div className="flex flex-shrink-0 items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 shadow-inner group-hover:border-cyan-500/30 transition-colors z-10 whitespace-nowrap">
                             <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                             </span>
                             <span className="text-xs font-bold text-cyan-400 tracking-wide uppercase">
                               {skill.proficiency_text}
                             </span>
                           </div>
                         )}
                         <div className="absolute -inset-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent group-hover:animate-pulse transition-all duration-1000 z-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div id="projects" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-emerald-400">Projects</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full mb-8"></div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {['All', 'Solo Projects', 'Group Projects'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-6 py-2 rounded-full font-bold transition-all duration-300 text-sm ${
                    projectFilter === filter 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p className="text-center text-slate-400 col-span-full text-lg mt-8">No {projectFilter !== 'All' ? projectFilter.toLowerCase() : 'projects'} found.</p>
            )}
          </div>
        </div>
      </div>



      {/* Contact Section (with Form and Contact Info side by side) */}
      <div id="contact" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Get In <span className="text-emerald-400">Touch</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-400">Have a question or want to work together? Drop a message!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* BRAND NEW: Contact Info Panel */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Contact Info</h3>
              
              <div className="space-y-3">
                
                {/* WhatsApp */}
                <a href={`https://wa.me/${(profile.whatsapp || profile.phone || '+94762251786').replace(/[-+]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300 shadow-lg shadow-transparent group-hover:shadow-[#25D366]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">WhatsApp</p>
                    <p className="text-slate-200 group-hover:text-emerald-400 font-medium transition-colors">{profile.whatsapp || profile.phone || '+94-762251786'}</p>
                  </div>
                </a>

                {/* Direct Call */}
                <a href={`tel:${profile.phone || '+94-762251786'}`} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">Direct Call</p>
                    <p className="text-slate-200 group-hover:text-cyan-400 font-medium transition-colors">{profile.phone || '+94-762251786'}</p>
                  </div>
                </a>
                
                {/* Email */}
                <a href={`mailto:${profile.email || 'kasundeni1997@gmail.com'}`} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">Email</p>
                    <p className="text-slate-200 group-hover:text-blue-400 font-medium transition-colors">{profile.email || 'kasundeni1997@gmail.com'}</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a href={profile.linkedin_link || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">LinkedIn</p>
                    <p className="text-slate-200 group-hover:text-indigo-400 font-medium transition-colors truncate max-w-[200px] sm:max-w-xs">{profile.linkedin_link || 'linkedin.com/in/kasunchathuranga-43a743321/'}</p>
                  </div>
                </a>

                {/* GitHub */}
                <a href={profile.github_link || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-slate-500/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">GitHub</p>
                    <p className="text-slate-200 group-hover:text-slate-100 font-medium transition-colors truncate max-w-[200px] sm:max-w-xs">{profile.github_link || 'github.com/KasunChathu97'}</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-semibold">Location</p>
                    <p className="text-slate-200 font-medium">{profile.address || 'Pallegama, Kolawenigama, Deniyaya'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Contact Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                    <input type="text" name="name" value={contactData.name} onChange={handleContactChange} required
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input type="email" name="email" value={contactData.email} onChange={handleContactChange} required
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition" placeholder="you@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input type="text" name="subject" value={contactData.subject} onChange={handleContactChange} required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition" placeholder="What is this about?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea name="message_body" value={contactData.message_body} onChange={handleContactChange} required rows="4"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none" placeholder="Your message here..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:from-emerald-400 hover:to-cyan-400 transition shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {status && (
                  <div className={`p-4 rounded-xl text-center font-medium ${status.includes('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {status}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Certifications Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl p-2 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-300 hover:text-white hover:bg-white/10 w-10 h-10 flex items-center justify-center rounded-full transition-all z-10 text-3xl font-light"
            >
              &times;
            </button>
            <img src={selectedCertImage} alt="Certificate" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;