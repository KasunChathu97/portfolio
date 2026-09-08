import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({ full_name: '', title: '', bio: '', profile_image_url: '', email: '', github_link: '', linkedin_link: '', phone: '', address: '', whatsapp: '' });
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
  const [projectData, setProjectData] = useState({ id: null, title: '', description: '', tech_stack: '', image_urls: '[]', github_link: '', live_link: '', project_type: 'Solo' });
  const [projectImages, setProjectImages] = useState([]);

  // Certifications State
  const [certifications, setCertifications] = useState([]);
  const [certData, setCertData] = useState({ id: null, title: '', issuer: '', issue_date: '', certificate_image_url: '' });
  const [certImage, setCertImage] = useState(null);

  // Skills State
  const [skills, setSkills] = useState([]);
  const [skillData, setSkillData] = useState({ id: null, name: '', main_category: 'Technical Skills', sub_category: '', proficiency_text: '', proficiency_percentage: '', skill_logo_url: '' });
  const [skillImage, setSkillImage] = useState(null);
  const [skillFilter, setSkillFilter] = useState('All');

  // Messages State
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const navigate = useNavigate();

  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

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
    fetchMessages();
  };

  const fetchProfile = () => axios.get('http://localhost:5000/api/profile').then(res => setProfileData(res.data)).catch(console.error);
  const fetchExperiences = () => axios.get('http://localhost:5000/api/experience').then(res => setExperiences(res.data)).catch(console.error);
  const fetchEducations = () => axios.get('http://localhost:5000/api/education').then(res => setEducations(res.data)).catch(console.error);
  const fetchProjects = () => axios.get('http://localhost:5000/api/projects').then(res => setProjects(res.data)).catch(console.error);
  const fetchCertifications = () => axios.get('http://localhost:5000/api/certifications').then(res => setCertifications(res.data)).catch(console.error);
  const fetchSkills = () => axios.get('http://localhost:5000/api/skills').then(res => setSkills(res.data)).catch(console.error);
  const fetchMessages = () => axios.get('http://localhost:5000/api/messages').then(res => setMessages(res.data)).catch(console.error);

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
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== null && projectData[key] !== '') {
        formData.append(key, projectData[key]);
      }
    });
    
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(file => {
        formData.append('project_images', file);
      });
    }

    const req = projectData.id 
      ? axios.put(`http://localhost:5000/api/projects/${projectData.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : axios.post('http://localhost:5000/api/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
    req.then(() => {
        setProjectData({ id: null, title: '', description: '', tech_stack: '', image_urls: '[]', github_link: '', live_link: '', project_type: 'Solo' });
        setProjectImages([]);
        setShowAddProject(false);
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
    const formData = new FormData();
    Object.keys(skillData).forEach(key => {
      if (skillData[key] !== null && skillData[key] !== '') {
        formData.append(key, skillData[key]);
      }
    });
    if (skillImage) formData.append('image', skillImage);

    const req = skillData.id 
      ? axios.put(`http://localhost:5000/api/skills/${skillData.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : axios.post('http://localhost:5000/api/skills', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    req.then(() => {
      setSkillData({ id: null, name: '', main_category: 'Technical Skills', sub_category: '', proficiency_text: '', proficiency_percentage: '', skill_logo_url: '' });
      setSkillImage(null);
      setShowAddSkill(false);
      fetchSkills();
    }).catch(console.error);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Management', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'certifications', label: 'Certifications', icon: '📜' },
    { id: 'skills', label: 'Skills', icon: '⭐' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'messages', label: 'Inbox', icon: '✉️' }
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

  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      axios.patch(`http://localhost:5000/api/messages/${msg.id}/read`)
        .then(() => {
          // Update local state to reflect read status instantly
          setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m));
        })
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-white font-sans pt-20">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Admin CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Portfolio Manager v1.0</p>
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
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Direct Call Number</p>
                    <p className="font-medium text-white text-lg">{profileData.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">WhatsApp Number</p>
                    <p className="font-medium text-white text-lg">{profileData.whatsapp || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl md:col-span-2">
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
                      <label className="block text-sm text-slate-400 mb-1">Direct Call Number</label>
                      <input type="text" value={profileData.phone || ''} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" placeholder="+94-762251786" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">WhatsApp Number</label>
                      <input type="text" value={profileData.whatsapp || ''} onChange={e => setProfileData({...profileData, whatsapp: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:border-emerald-500" placeholder="+94-762251786" />
                    </div>
                    <div className="md:col-span-2">
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
                     <input type="text" placeholder="Project Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <textarea placeholder="Description/Highlights" value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" rows="3" required></textarea>
                     <input type="text" placeholder="Tech Stack (comma-separated, e.g., PHP, MySQL, Bootstrap)" value={projectData.tech_stack} onChange={e => setProjectData({...projectData, tech_stack: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="url" placeholder="GitHub Link" value={projectData.github_link || ''} onChange={e => setProjectData({...projectData, github_link: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                     <input type="url" placeholder="Live Project Link (optional)" value={projectData.live_link || ''} onChange={e => setProjectData({...projectData, live_link: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
                     <select value={projectData.project_type || 'Solo'} onChange={e => setProjectData({...projectData, project_type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required>
                       <option value="Solo">Solo Project</option>
                       <option value="Group">Group Project</option>
                     </select>
                     <div>
                       <label className="text-xs text-slate-400 block mb-1">Project Images (Up to 4)</label>
                       <input type="file" multiple accept="image/*" max="4" onChange={e => setProjectImages(Array.from(e.target.files))} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300" />
                     </div>
                     <div className="flex space-x-4 pt-2">
                       <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 transition text-white px-4 py-2 rounded-lg font-bold flex-1">{projectData.id ? 'Update Project' : 'Publish Project'}</button>
                       {projectData.id && <button type="button" onClick={() => {setProjectData({id:null, title:'', description:'', tech_stack:'', image_urls:'[]', github_link:'', live_link:'', project_type:'Solo'}); setProjectImages([]); setShowAddProject(false);}} className="bg-slate-700 hover:bg-slate-600 transition text-white px-4 py-2 rounded-lg">Cancel</button>}
                     </div>
                   </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                 <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                   {projects.map(p => {
                     let firstImage = null;
                     try {
                       const parsed = JSON.parse(p.image_urls);
                       if (Array.isArray(parsed) && parsed.length > 0) firstImage = parsed[0];
                     } catch(e) {
                       firstImage = p.image_urls; // Fallback
                     }
                     return (
                     <div key={p.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-start border border-slate-700 hover:border-emerald-500/50 transition">
                        <div className="flex gap-4">
                           {firstImage ? (
                             <img src={getImageUrl(firstImage)} alt="Project" className="w-20 h-14 rounded object-cover" />
                           ) : (
                             <div className="w-20 h-14 rounded bg-slate-700 flex items-center justify-center text-xs">N/A</div>
                           )}
                           <div>
                             <p className="font-bold">{p.title}</p>
                             <p className="text-sm text-slate-400">{p.tech_stack}</p>
                           </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button onClick={() => { setProjectData(p); setShowAddProject(true); }} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded font-semibold transition">Edit</button>
                          <button onClick={() => {if(window.confirm('Delete project?')) axios.delete(`http://localhost:5000/api/projects/${p.id}`).then(fetchProjects)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded font-semibold transition">Delete</button>
                        </div>
                     </div>
                   );
                   })}
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
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-6 rounded-2xl gap-4">
                 <h2 className="text-2xl font-bold">Manage Skills</h2>
                 <button onClick={() => setShowAddSkill(!showAddSkill)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold transition w-full md:w-auto">
                   {showAddSkill ? 'Close Form' : '+ Add Skill'}
                 </button>
              </div>

              {showAddSkill && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                  <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{skillData.id ? 'Edit Skill' : 'Add New Skill'}</h2>
                  <form onSubmit={handleSkillSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Main Category</label>
                      <select value={skillData.main_category} onChange={e => setSkillData({...skillData, main_category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required>
                        <option value="Soft Skills">Soft Skills</option>
                        <option value="Languages">Languages</option>
                        <option value="Technical Skills">Technical Skills</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        {skillData.main_category === 'Soft Skills' ? 'Soft Skill Name' : (skillData.main_category === 'Languages' ? 'Language' : 'Technical Skill Category (e.g., Frontend Development)')}
                      </label>
                      <input type="text" placeholder={skillData.main_category === 'Technical Skills' ? 'Frontend Development' : 'e.g., Reactjs, Teamwork, English'} value={skillData.name} onChange={e => setSkillData({...skillData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                    </div>

                    {skillData.main_category === 'Soft Skills' && (
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Proficiency Percentage (0 - 100)</label>
                        <input type="number" min="0" max="100" placeholder="85" value={skillData.proficiency_percentage || ''} onChange={e => setSkillData({...skillData, proficiency_percentage: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
                      </div>
                    )}

                    {skillData.main_category === 'Languages' && (
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Proficiency Level</label>
                        <select value={skillData.proficiency_text || ''} onChange={e => setSkillData({...skillData, proficiency_text: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white">
                          <option value="">Select Level</option>
                          <option value="Basic">Basic</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native / Bilingual">Native / Bilingual</option>
                        </select>
                      </div>
                    )}

                    {skillData.main_category === 'Technical Skills' && (
                      <>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Skill Item (e.g., Reactjs, Bootstrap)</label>
                          <input type="text" placeholder="Reactjs" value={skillData.sub_category || ''} onChange={e => setSkillData({...skillData, sub_category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" required />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Skill Item Logo / Icon</label>
                          <input type="file" onChange={e => setSkillImage(e.target.files[0])} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300" accept="image/*" />
                        </div>
                      </>
                    )}
                    <div className="flex space-x-4 pt-2">
                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 transition text-white px-4 py-2 rounded-lg font-bold flex-1">{skillData.id ? 'Update' : 'Add'}</button>
                      {skillData.id && <button type="button" onClick={() => {setSkillData({id:null, name:'', main_category:'Technical Skills', sub_category:''}); setShowAddSkill(false);}} className="bg-slate-700 hover:bg-slate-600 transition text-white px-4 py-2 rounded-lg">Cancel</button>}
                    </div>
                  </form>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white">Manage Skills</h3>
                  <select 
                    value={skillFilter} 
                    onChange={e => setSkillFilter(e.target.value)} 
                    className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300 outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Languages">Languages</option>
                    <option value="Technical Skills">Technical Skills</option>
                  </select>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {(skillFilter === 'All' ? skills : skills.filter(s => s.main_category === skillFilter)).map(s => (
                    <div key={s.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:border-emerald-500/50 transition">
                      <div>
                        <p className="font-bold text-white text-lg">{s.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${s.main_category === 'Soft Skills' ? 'bg-cyan-500/20 text-cyan-400' : s.main_category === 'Languages' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {s.main_category}
                          </span>
                          {s.sub_category && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{s.sub_category}</span>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setSkillData(s); setShowAddSkill(true); }} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded font-semibold transition">Edit</button>
                        <button onClick={() => {if(window.confirm('Delete skill?')) axios.delete(`http://localhost:5000/api/skills/${s.id}`).then(fetchSkills)}} className="text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1 rounded font-semibold transition">Delete</button>
                      </div>
                    </div>
                  ))}
                  {(skillFilter === 'All' ? skills : skills.filter(s => s.main_category === skillFilter)).length === 0 && <p className="text-slate-400 text-center py-10">No skills found.</p>}
                </div>
              </div>
            </div>
          )}


          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-[calc(100vh-120px)] relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">✉️</span> Inbox
                </h2>
                <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                  {messages.filter(m => !m.is_read).length} Unread
                </span>
              </div>
              
              {/* Compact Message List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div 
                      key={msg.id} 
                      onClick={() => handleMessageClick(msg)}
                      className={`px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 hover:bg-white/10 ${
                        msg.is_read ? 'bg-slate-800/30 border-transparent opacity-80' : 'bg-slate-800/80 border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {!msg.is_read ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] flex-shrink-0 animate-pulse"></span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-transparent flex-shrink-0"></span>
                        )}
                        <h3 className={`w-1/4 truncate ${msg.is_read ? 'text-slate-300' : 'text-white font-bold'}`}>
                          {msg.name}
                        </h3>
                        <p className={`flex-1 truncate ${msg.is_read ? 'text-slate-400' : 'text-slate-200 font-semibold'}`}>
                          {msg.subject}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 flex-shrink-0 w-32 text-right">
                        {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <span className="text-4xl mb-3">📭</span>
                    <p>No messages in your inbox.</p>
                  </div>
                )}
              </div>

              {/* Message Detail Modal */}
              {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                        <p className="text-slate-300">
                          <span className="text-slate-500 mr-2">From:</span> 
                          <span className="font-semibold text-white">{selectedMessage.name}</span> 
                          <span className="text-emerald-400 ml-2">&lt;<a href={`mailto:${selectedMessage.email}`} className="hover:underline">{selectedMessage.email}</a>&gt;</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(selectedMessage.created_at).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedMessage(null)}
                        className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-900/50">
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-base">
                        {selectedMessage.message_body}
                      </p>
                    </div>

                    <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900">
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to delete this message?')) {
                            axios.delete(`http://localhost:5000/api/messages/${selectedMessage.id}`)
                              .then(() => {
                                setSelectedMessage(null);
                                fetchMessages();
                              })
                              .catch(console.error);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      >
                        🗑️ Delete
                      </button>
                      
                      <button 
                        onClick={() => setSelectedMessage(null)}
                        className="text-white bg-slate-700 hover:bg-slate-600 px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
