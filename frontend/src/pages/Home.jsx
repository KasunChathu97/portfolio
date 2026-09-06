import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

function Home() {
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [contactData, setContactData] = useState({ sender_name: '', sender_email: '', message: '' });
  const [status, setStatus] = useState('');
  
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
    setStatus('Sending...');
    axios.post('http://localhost:5000/api/messages', contactData)
      .then(() => {
        setStatus('Message sent successfully!');
        setContactData({ sender_name: '', sender_email: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      })
      .catch(() => setStatus('Error sending message.'));
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

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

      {/* Skills Section */}
      {skills.length > 0 && (
        <div id="skills" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-emerald-400">Skills</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map(skill => (
                <div key={skill.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-bold text-white">{skill.skill_name}</span>
                    <span className="text-emerald-400 font-semibold">{skill.proficiency || skill.category || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full" 
                      style={{ width: `${skill.proficiency || skill.category || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Projects Section */}
      <div id="projects" className="scroll-mt-20 bg-slate-900 py-24 border-t border-white/5 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">My <span className="text-emerald-400">Projects</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p className="text-center text-slate-400 col-span-full text-lg">No projects published yet.</p>
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
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📞</div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-white font-medium text-lg">{profile.phone || '+94-762251786'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📍</div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Address</p>
                    <p className="text-white font-medium text-lg">{profile.address || 'Pallegama, Kolawenigama, Deniyaya'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📧</div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Email</p>
                    <p className="text-white font-medium text-lg">{profile.email || 'kasundeni1997@gmail.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">🔗</div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">LinkedIn</p>
                    <a href={profile.linkedin_link || '#'} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium text-lg break-all">
                      {profile.linkedin_link || 'linkedin.com/in/kasunchathuranga-43a743321/'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-500/20 text-slate-300 rounded-full flex items-center justify-center text-2xl flex-shrink-0">💻</div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">GitHub</p>
                    <a href={profile.github_link || '#'} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium text-lg break-all">
                      {profile.github_link || 'https://github.com/KasunChathu97'}
                    </a>
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
                    <input type="text" name="sender_name" value={contactData.sender_name} onChange={handleContactChange} required
                      className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input type="email" name="sender_email" value={contactData.sender_email} onChange={handleContactChange} required
                      className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" placeholder="you@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea name="message" value={contactData.message} onChange={handleContactChange} required rows="5"
                    className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none" placeholder="Your message here..."></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:from-emerald-400 hover:to-cyan-400 transition shadow-lg shadow-emerald-500/25">
                  Send Message
                </button>
                
                {status && <p className="text-center text-emerald-400 font-medium mt-4">{status}</p>}
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