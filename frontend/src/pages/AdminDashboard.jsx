import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({ full_name: '', title: '', bio: '', profile_image_url: '', email: '', github_link: '', linkedin_link: '', phone: '', address: '' });
  const [profileImage, setProfileImage] = useState(null);

  // Experience State
  const [experiences, setExperiences] = useState([]);
  const [expData, setExpData] = useState({ id: null, position: '', company_name: '', company_url: '', start_date: '', end_date: '', is_current: false, company_logo_url: '' });
  const [expImage, setExpImage] = useState(null);

  // Education State
  const [educations, setEducations] = useState([]);
  const [eduData, setEduData] = useState({ id: null, degree_course_name: '', institution_name: '', start_date: '', end_date: '', is_current: false, logo_url: '', institution_url: '', description: '' });
  const [eduImage, setEduImage] = useState(null);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({ id: null, title: '', description: '', tech_stack: '', image_url: '', project_link: '' });
  const [projectImage, setProjectImage] = useState(null);

  // Certifications State
  const [certifications, setCertifications] = useState([]);
  const [certData, setCertData] = useState({ id: null, title: '', issuer: '', issue_date: '', certificate_image_url: '' });
  const [certImage, setCertImage] = useState(null);

  // Skills State
  const [skills, setSkills] = useState([]);
  const [skillData, setSkillData] = useState({ id: null, skill_name: '', proficiency: '', category: '' });

  const navigate = useNavigate();

  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchAllData();
    }
  }, [navigate]);

  const fetchAllData = () => {
    fetchProfile();
    fetchExperiences();
    fetchEducations();
    fetchProjects();
    fetchCertifications();
    fetchSkills();
  };

  const fetchProfile = () => axios.get('http://localhost:5000/api/profile').then(res => setProfileData(res.data)).catch(console.error);
  const fetchExperiences = () => axios.get('http://localhost:5000/api/experience').then(res => setExperiences(res.data)).catch(console.error);
  const fetchEducations = () => axios.get('http://localhost:5000/api/education').then(res => setEducations(res.data)).catch(console.error);
  const fetchProjects = () => axios.get('http://localhost:5000/api/projects').then(res => setProjects(res.data)).catch(console.error);
  const fetchCertifications = () => axios.get('http://localhost:5000/api/certifications').then(res => setCertifications(res.data)).catch(console.error);
  const fetchSkills = () => axios.get('http://localhost:5000/api/skills').then(res => setSkills(res.data)).catch(console.error);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  // --- Handlers ---
  const createFormData = (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return formData;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(profileData, profileImage);
    axios.put('http://localhost:5000/api/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert('Profile updated successfully!');
        setProfileImage(null);
        setIsEditingProfile(false);
        fetchProfile();
      }).catch(console.error);
  };

  const handleExpSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(expData, expImage);
    const req = expData.id 
      ? axios.put(`http://localhost:5000/api/experience/${expData.id}`, formData)
      : axios.post('http://localhost:5000/api/experience', formData);
    
    req.then(() => {
      setExpData({ id: null, position: '', company_name: '', company_url: '', start_date: '', end_date: '', is_current: false, company_logo_url: '' });
      setExpImage(null);
      fetchExperiences();
    }).catch(console.error);
  };

  const handleEduSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(eduData, eduImage);
    const req = eduData.id 
      ? axios.put(`http://localhost:5000/api/education/${eduData.id}`, formData)
      : axios.post('http://localhost:5000/api/education', formData);
    
    req.then(() => {
      setEduData({ id: null, degree_course_name: '', institution_name: '', start_date: '', end_date: '', is_current: false, logo_url: '', institution_url: '', description: '' });
      setEduImage(null);
      fetchEducations();
    }).catch(console.error);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(projectData, projectImage);
    const req = projectData.id 
      ? axios.put(`http://localhost:5000/api/projects/${projectData.id}`, formData)
      : axios.post('http://localhost:5000/api/projects', formData);
      
    req.then(() => {
        setProjectData({ id: null, title: '', description: '', tech_stack: '', image_url: '', project_link: '' });
        setProjectImage(null);
        fetchProjects();
    }).catch(console.error);
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(certData, certImage);
    const req = certData.id 
      ? axios.put(`http://localhost:5000/api/certifications/${certData.id}`, formData)
      : axios.post('http://localhost:5000/api/certifications', formData);
    
    req.then(() => {
      setCertData({ id: null, title: '', issuer: '', issue_date: '', certificate_image_url: '' });
      setCertImage(null);
      setShowAddCertification(false);
      fetchCertifications();
    }).catch(console.error);
  };

  const handleSkillSubmit = (e) => {
    e.preventDefault();
    const req = skillData.id 
      ? axios.put(`http://localhost:5000/api/skills/${skillData.id}`, skillData)
      : axios.post('http://localhost:5000/api/skills', skillData);
    
    req.then(() => {
      setSkillData({ id: null, skill_name: '', proficiency: '', category: '' });
      fetchSkills();
    }).catch(console.error);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Management', icon: '👤' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'certifications', label: 'Certifications', icon: '📜' },
    { id: 'skills', label: 'Skills', icon: '⭐' }
  ];

  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = createFormData(profileData, profileImage);
    axios.put('http://localhost:5000/api/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert('Contact updated successfully!');
        setIsEditingContact(false);
        fetchProfile();
      }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-white font-sans pt-20">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Admin CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Portfolio Manager v2.0</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition font-bold">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0a192f]">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-slate-900">
          <h1 className="text-xl font-bold text-emerald-400">Admin CMS</h1>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2"
          >
            {menuItems.map(item => (
               <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="p-8 max-w-6xl mx-auto">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-white">Profile Management</h2>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                /* READ-ONLY VIEW */
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl w-full md:w-1/3">
                    <div className="w-40 h-40 rounded-full border-4 border-emerald-500/50 mb-4 overflow-hidden bg-slate-800 flex items-center justify-center">
                      {profileData.profile_image_url ? (
                        <img src={getImageUrl(profileData.profile_image_url)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 text-sm">No Image</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center">{profileData.full_name}</h3>
                    <p className="text-emerald-400 font-medium mt-1 text-center">{profileData.title}</p>
                  </div>
                  
                  <div className="flex-1 w-full space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl h-full">
                      <h4 className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Bio / Description</h4>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{profileData.bio || 'No bio provided.'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                      <input type="text" value={profileData.full_name || ''} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Title</label>
                      <input type="text" value={profileData.title || ''} onChange={e => setProfileData({...profileData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Bio</label>
                    <textarea value={profileData.bio || ''} onChange={e => setProfileData({...profileData, bio: e.target.value})} rows="5" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" required></textarea>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Profile Image Upload (Multer)</label>
                    <input type="file" onChange={e => setProfileImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white cursor-pointer" accept="image/*" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition">Save Profile</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-8 rounded-xl transition">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-white">Contact Management</h2>
                {!isEditingContact && (
                  <button onClick={() => setIsEditingContact(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2">
                    ✏️ Edit Contact Info
                  </button>
                )}
              </div>

              {!isEditingContact ? (
                /* READ-ONLY VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Phone Number</p>
                    <p className="font-medium text-white text-lg">{profileData.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Email Address</p>
                    <p className="font-medium text-white text-lg">{profileData.email || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl md:col-span-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Physical Address</p>
                    <p className="font-medium text-white text-lg">{profileData.address || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">LinkedIn Profile</p>
                    <p className="font-medium text-blue-400 truncate">{profileData.linkedin_link || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">GitHub Profile</p>
                    <p className="font-medium text-blue-400 truncate">{profileData.github_link || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Phone</label>
                      <input type="text" value={profileData.phone || ''} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Email</label>
                      <input type="email" value={profileData.email || ''} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-slate-400 mb-1">Address</label>
                      <input type="text" value={profileData.address || ''} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">LinkedIn Link</label>
                      <input type="text" value={profileData.linkedin_link || ''} onChange={e => setProfileData({...profileData, linkedin_link: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">GitHub Link</label>
                      <input type="text" value={profileData.github_link || ''} onChange={e => setProfileData({...profileData, github_link: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition">Save Contact Info</button>
                    <button type="button" onClick={() => setIsEditingContact(false)} className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-8 rounded-xl transition">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-6 rounded-2xl gap-4">
                 <h2 className="text-2xl font-bold">Manage Experience</h2>
                 <button onClick={() => setShowAddExperience(!showAddExperience)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition w-full md:w-auto">
                   {showAddExperience ? 'Close Form' : '+ Add Experience'}
                 </button>
              </div>

              {showAddExperience && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                   <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{expData.id ? 'Edit Working Experience' : 'Add New Working Experience'}</h2>
                   <form onSubmit={handleExpSubmit} className="space-y-4">
                     <input type="text" placeholder="Position (e.g. IT Assistant)" value={expData.position} onChange={e => setExpData({...expData, position: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="text" placeholder="Company Name" value={expData.company_name} onChange={e => setExpData({...expData, company_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="url" placeholder="Company Website Link (e.g. https://...)" value={expData.company_url || ''} onChange={e => setExpData({...expData, company_url: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
                     
                     <div className="flex gap-4">
                       <div className="flex-1">
                         <label className="text-xs text-slate-400">Start Date (Month/Year)</label>
                         <input type="text" placeholder="e.g. 2018 or Jan 2018" value={expData.start_date || ''} onChange={e => setExpData({...expData, start_date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                       </div>
                       <div className="flex-1">
                         <label className="text-xs text-slate-400">End Date</label>
                         <input type="text" placeholder="e.g. 2023" value={expData.end_date || ''} onChange={e => setExpData({...expData, end_date: e.target.value})} disabled={expData.is_current} className={`w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white ${expData.is_current ? 'opacity-50 cursor-not-allowed' : ''}`} />
                       </div>
                     </div>
                     
                     <label className="flex items-center space-x-3 cursor-pointer">
                       <input type="checkbox" checked={expData.is_current || false} onChange={e => setExpData({...expData, is_current: e.target.checked, end_date: e.target.checked ? '' : expData.end_date})} className="form-checkbox h-5 w-5 text-emerald-500 rounded border-slate-600 bg-slate-800" />
                       <span className="text-slate-300">I currently work here</span>
                     </label>
                     
                     <div>
                       <label className="text-xs text-slate-400 block mb-1">Company Logo</label>
                       <input type="file" onChange={e => setExpImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300" accept="image/*" />
                     </div>

                     <div className="flex space-x-4 pt-2">
                       <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 transition text-white px-4 py-2 rounded-lg font-bold flex-1">{expData.id ? 'Update Experience' : 'Add Experience'}</button>
                       {expData.id && <button type="button" onClick={() => {setExpData({id:null, position:'', company_name:'', company_url:'', start_date:'', end_date:'', is_current:false, company_logo_url:''}); setExpImage(null); setShowAddExperience(false);}} className="bg-slate-700 hover:bg-slate-600 transition text-white px-4 py-2 rounded-lg">Cancel</button>}
                     </div>
                   </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                 <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                   {experiences.map(e => (
                     <div key={e.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-start border border-slate-700 hover:border-emerald-500/50 transition">
                        <div className="flex gap-4 items-center">
                          {e.company_logo_url ? (
                            <img src={getImageUrl(e.company_logo_url)} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-white border border-slate-600 p-1" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold">No Logo</div>
                          )}
                          <div>
                            <p className="font-bold text-lg text-white">{e.position}</p>
                            <p className="text-sm text-slate-300 font-medium">{e.company_name}</p>
                            <p className="text-xs text-emerald-400 mt-1 font-semibold">{e.start_date} {e.is_current ? '- Present' : (e.end_date ? `- ${e.end_date}` : '')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => { setExpData({ ...e, is_current: !!e.is_current }); setShowAddExperience(true); }} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded font-semibold transition">Edit</button>
                          <button onClick={() => {if(window.confirm('Delete experience?')) axios.delete(`http://localhost:5000/api/experience/${e.id}`).then(fetchExperiences)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded font-semibold transition">Delete</button>
                        </div>
                     </div>
                   ))}
                   {experiences.length === 0 && <p className="text-slate-400 text-center py-10">No working experiences added yet.</p>}
                 </div>
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-6 rounded-2xl gap-4">
                 <h2 className="text-2xl font-bold">Manage Education</h2>
                 <button onClick={() => setShowAddEducation(!showAddEducation)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition w-full md:w-auto">
                   {showAddEducation ? 'Close Form' : '+ Add Education'}
                 </button>
              </div>

              {showAddEducation && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                   <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{eduData.id ? 'Edit Education' : 'Add New Education'}</h2>
                   <form onSubmit={handleEduSubmit} className="space-y-4">
                     <input type="text" placeholder="Degree/Course Name" value={eduData.degree_course_name} onChange={e => setEduData({...eduData, degree_course_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="text" placeholder="Institution Name" value={eduData.institution_name} onChange={e => setEduData({...eduData, institution_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="url" placeholder="Institution Website Link (e.g. https://...)" value={eduData.institution_url || ''} onChange={e => setEduData({...eduData, institution_url: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
                     
                     <div className="flex gap-4">
                       <div className="flex-1">
                         <label className="text-xs text-slate-400">Start Date</label>
                         <input type="text" placeholder="e.g. 2017" value={eduData.start_date || ''} onChange={e => setEduData({...eduData, start_date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                       </div>
                       <div className="flex-1">
                         <label className="text-xs text-slate-400">End Date</label>
                         <input type="text" placeholder="e.g. 2021" value={eduData.end_date || ''} onChange={e => setEduData({...eduData, end_date: e.target.value})} disabled={eduData.is_current} className={`w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white ${eduData.is_current ? 'opacity-50 cursor-not-allowed' : ''}`} />
                       </div>
                     </div>
                     
                     <label className="flex items-center space-x-3 cursor-pointer">
                       <input type="checkbox" checked={eduData.is_current || false} onChange={e => setEduData({...eduData, is_current: e.target.checked, end_date: e.target.checked ? '' : eduData.end_date})} className="form-checkbox h-5 w-5 text-emerald-500 rounded border-slate-600 bg-slate-800" />
                       <span className="text-slate-300">Currently Studying Here</span>
                     </label>
                     
                     <textarea placeholder="Description (e.g., Grades, Awards)" value={eduData.description || ''} onChange={e => setEduData({...eduData, description: e.target.value})} rows="3" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white"></textarea>

                     <div>
                       <label className="text-xs text-slate-400 block mb-1">Institution Logo</label>
                       <input type="file" onChange={e => setEduImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300" accept="image/*" />
                     </div>

                     <div className="flex space-x-4 pt-2">
                       <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 transition text-white px-4 py-2 rounded-lg font-bold flex-1">{eduData.id ? 'Update Education' : 'Add Education'}</button>
                       {eduData.id && <button type="button" onClick={() => {setEduData({id:null, degree_course_name:'', institution_name:'', start_date:'', end_date:'', is_current:false, logo_url:'', institution_url:'', description:''}); setEduImage(null); setShowAddEducation(false);}} className="bg-slate-700 hover:bg-slate-600 transition text-white px-4 py-2 rounded-lg">Cancel</button>}
                     </div>
                   </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                 <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                   {educations.map(edu => (
                     <div key={edu.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-start border border-slate-700 hover:border-emerald-500/50 transition">
                        <div className="flex gap-4 items-center">
                          {edu.logo_url ? (
                            <img src={getImageUrl(edu.logo_url)} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-white border border-slate-600 p-1" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold">No Logo</div>
                          )}
                          <div>
                            <p className="font-bold text-lg text-white">{edu.degree_course_name}</p>
                            <p className="text-sm text-slate-300 font-medium">{edu.institution_name}</p>
                            <p className="text-xs text-emerald-400 mt-1 font-semibold">{edu.start_date} {edu.is_current ? '- Present' : (edu.end_date ? `- ${edu.end_date}` : '')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => { setEduData({ ...edu, is_current: !!edu.is_current }); setShowAddEducation(true); }} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded font-semibold transition">Edit</button>
                          <button onClick={() => {if(window.confirm('Delete education?')) axios.delete(`http://localhost:5000/api/education/${edu.id}`).then(fetchEducations)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded font-semibold transition">Delete</button>
                        </div>
                     </div>
                   ))}
                   {educations.length === 0 && <p className="text-slate-400 text-center py-10">No education records added yet.</p>}
                 </div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-6 rounded-2xl gap-4">
                 <h2 className="text-2xl font-bold">Manage Projects</h2>
                 <button onClick={() => setShowAddProject(!showAddProject)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition w-full md:w-auto">
                   {showAddProject ? 'Close Form' : '+ Add Project'}
                 </button>
              </div>

              {showAddProject && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                   <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{projectData.id ? 'Edit Project' : 'Add New Project'}</h2>
                   <form onSubmit={handleProjectSubmit} className="space-y-4">
                     <input type="text" placeholder="Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" required />
                     <textarea placeholder="Description" value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" rows="3" required></textarea>
                     <input type="text" placeholder="Tech Stack" value={projectData.tech_stack} onChange={e => setProjectData({...projectData, tech_stack: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" required />
                     <input type="text" placeholder="Project Link" value={projectData.project_link} onChange={e => setProjectData({...projectData, project_link: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" />
                     <div>
                       <label className="text-xs text-slate-400 block mb-1">Project Image</label>
                       <input type="file" onChange={e => setProjectImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm" accept="image/*" />
                     </div>
                     <div className="flex space-x-4 pt-2">
                       <button type="submit" className="bg-emerald-500 px-4 py-2 rounded-lg font-bold flex-1">{projectData.id ? 'Update' : 'Publish'}</button>
                       {projectData.id && <button type="button" onClick={() => {setProjectData({id:null, title:'', description:'', tech_stack:'', image_url:'', project_link:''}); setProjectImage(null); setShowAddProject(false);}} className="bg-slate-700 px-4 py-2 rounded-lg">Cancel</button>}
                     </div>
                   </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                 <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                   {projects.map(p => (
                     <div key={p.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-start border border-slate-700 hover:border-emerald-500/50 transition">
                        <div className="flex gap-4">
                           {p.image_url ? (
                             <img src={getImageUrl(p.image_url)} alt="Project" className="w-20 h-14 rounded object-cover" />
                           ) : (
                             <div className="w-20 h-14 rounded bg-slate-700 flex items-center justify-center text-xs">N/A</div>
                           )}
                           <div>
                             <p className="font-bold">{p.title}</p>
                             <p className="text-sm text-slate-400">{p.tech_stack}</p>
                           </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button onClick={() => { setProjectData(p); setShowAddProject(true); }} className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded">Edit</button>
                          <button onClick={() => {if(window.confirm('Delete project?')) axios.delete(`http://localhost:5000/api/projects/${p.id}`).then(fetchProjects)}} className="bg-red-500/10 text-red-400 px-3 py-1 rounded">Delete</button>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-6 rounded-2xl gap-4">
                 <h2 className="text-2xl font-bold">Manage Certifications</h2>
                 <button onClick={() => setShowAddCertification(!showAddCertification)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition w-full md:w-auto">
                   {showAddCertification ? 'Close Form' : '+ Add Certification'}
                 </button>
              </div>

              {showAddCertification && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                  <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{certData.id ? 'Edit Certification' : 'Add New Certification'}</h2>
                  <form onSubmit={handleCertSubmit} className="space-y-4">
                    <input type="text" placeholder="Certification Name" value={certData.title} onChange={e => setCertData({...certData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                    <input type="text" placeholder="Issued Organization" value={certData.issuer} onChange={e => setCertData({...certData, issuer: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Issue Date</label>
                      <input type="date" value={certData.issue_date ? new Date(certData.issue_date).toISOString().split('T')[0] : ''} onChange={e => setCertData({...certData, issue_date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Certificate Image / Badge</label>
                      <input type="file" onChange={e => setCertImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300" accept="image/*" />
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 transition text-white px-4 py-2 rounded-lg font-bold flex-1">{certData.id ? 'Update' : 'Add'}</button>
                      {certData.id && <button type="button" onClick={() => {setCertData({id:null, title:'', issuer:'', issue_date:'', certificate_image_url:''}); setCertImage(null); setShowAddCertification(false);}} className="bg-slate-700 hover:bg-slate-600 transition text-white px-4 py-2 rounded-lg">Cancel</button>}
                    </div>
                  </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                  {certifications.map(c => (
                    <div key={c.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-start border border-slate-700 hover:border-emerald-500/50 transition">
                      <div className="flex gap-4 items-center">
                        {c.certificate_image_url || c.image_url ? (
                          <img src={getImageUrl(c.certificate_image_url || c.image_url)} alt="Cert" className="w-16 h-16 rounded-lg object-contain bg-white border border-slate-600 p-1" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold">No Image</div>
                        )}
                        <div>
                          <p className="font-bold text-lg text-white">{c.title}</p>
                          <p className="text-sm text-slate-300 font-medium">{c.issuer}</p>
                          <p className="text-xs text-emerald-400 mt-1 font-semibold">{c.issue_date && new Date(c.issue_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setCertData(c); setShowAddCertification(true); }} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded font-semibold transition">Edit</button>
                        <button onClick={() => {if(window.confirm('Delete cert?')) axios.delete(`http://localhost:5000/api/certifications/${c.id}`).then(fetchCertifications)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded font-semibold transition">Delete</button>
                      </div>
                    </div>
                  ))}
                  {certifications.length === 0 && <p className="text-slate-400 text-center py-10">No certifications added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{skillData.id ? 'Edit Skill' : 'Add Skill'}</h2>
                <form onSubmit={handleSkillSubmit} className="space-y-4">
                  <input type="text" placeholder="Skill Name" value={skillData.skill_name} onChange={e => setSkillData({...skillData, skill_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" required />
                  <input type="number" placeholder="Proficiency (0-100)" min="0" max="100" value={skillData.proficiency} onChange={e => setSkillData({...skillData, proficiency: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" required />
                  <input type="text" placeholder="Category (e.g. Frontend)" value={skillData.category || ''} onChange={e => setSkillData({...skillData, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg" />
                  <div className="flex space-x-4 pt-2">
                    <button type="submit" className="bg-emerald-500 px-4 py-2 rounded-lg font-bold flex-1">{skillData.id ? 'Update' : 'Add'}</button>
                    {skillData.id && <button type="button" onClick={() => setSkillData({id:null, skill_name:'', proficiency:'', category:''})} className="bg-slate-700 px-4 py-2 rounded-lg">Cancel</button>}
                  </div>
                </form>
              </div>
              
              <div className="lg:col-span-3 bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Manage Skills</h2>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {skills.map(s => (
                    <div key={s.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:border-emerald-500/50 transition">
                      <div>
                        <p className="font-bold text-white">{s.skill_name} <span className="text-xs bg-slate-700 px-2 rounded ml-2">{s.category}</span></p>
                        <p className="text-sm text-emerald-400">{s.proficiency || 0}%</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => setSkillData(s)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded">Edit</button>
                        <button onClick={() => {if(window.confirm('Delete skill?')) axios.delete(`http://localhost:5000/api/skills/${s.id}`).then(fetchSkills)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-96">
              <span className="text-6xl mb-4">⚙️</span>
              <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
              <p className="text-slate-400 max-w-md">Global configuration, themes, and account settings will be available in future updates.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
