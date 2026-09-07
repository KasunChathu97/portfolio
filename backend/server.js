const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve /uploads statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// BASIC ROUTES
// ==========================================
app.get('/', (req, res) => {
    res.send('Portfolio Backend is running with Multer!');
});

// ==========================================
// PROJECTS APIs
// ==========================================
app.get('/api/projects', (req, res) => {
    const sql = "SELECT * FROM projects ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/projects', upload.array('project_images', 4), (req, res) => {
    const { title, description, tech_stack, github_link, live_link, project_type } = req.body;
    let image_urls = req.body.image_urls || '[]'; 
    if (req.files && req.files.length > 0) {
        const paths = req.files.map(file => `/uploads/${file.filename}`);
        image_urls = JSON.stringify(paths);
    }
    const sql = "INSERT INTO projects (title, description, tech_stack, image_urls, github_link, live_link, project_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, tech_stack, image_urls, github_link, live_link || null, project_type || 'Solo'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Project added!", id: result.insertId });
    });
});

app.put('/api/projects/:id', upload.array('project_images', 4), (req, res) => {
    const { title, description, tech_stack, github_link, live_link, project_type } = req.body;
    let image_urls = req.body.image_urls; 
    if (req.files && req.files.length > 0) {
        const paths = req.files.map(file => `/uploads/${file.filename}`);
        image_urls = JSON.stringify(paths);
    }
    const sql = "UPDATE projects SET title=?, description=?, tech_stack=?, image_urls=?, github_link=?, live_link=?, project_type=? WHERE id=?";
    db.query(sql, [title, description, tech_stack, image_urls, github_link, live_link || null, project_type || 'Solo', req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Project updated!" });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    const sql = "DELETE FROM projects WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Project deleted!" });
    });
});

// ==========================================
// EXPERIENCE APIs
// ==========================================
app.get('/api/experience', (req, res) => {
    const sql = "SELECT * FROM working_experience ORDER BY start_date DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/experience', upload.single('image'), (req, res) => {
    const { position, company_name, start_date, end_date, company_url } = req.body;
    const is_current = req.body.is_current === 'true' || req.body.is_current === '1' || req.body.is_current === true ? 1 : 0;
    let company_logo_url = req.body.company_logo_url || '';
    if (req.file) {
        company_logo_url = `/uploads/${req.file.filename}`;
    }
    const sql = "INSERT INTO working_experience (position, company_name, start_date, end_date, is_current, company_logo_url, company_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [position, company_name, start_date, end_date, is_current, company_logo_url, company_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Working experience added!", id: result.insertId });
    });
});

app.put('/api/experience/:id', upload.single('image'), (req, res) => {
    const { position, company_name, start_date, end_date, company_url } = req.body;
    const is_current = req.body.is_current === 'true' || req.body.is_current === '1' || req.body.is_current === true ? 1 : 0;
    let company_logo_url = req.body.company_logo_url || '';
    if (req.file) {
        company_logo_url = `/uploads/${req.file.filename}`;
    }
    const sql = "UPDATE working_experience SET position=?, company_name=?, start_date=?, end_date=?, is_current=?, company_logo_url=?, company_url=? WHERE id=?";
    db.query(sql, [position, company_name, start_date, end_date, is_current, company_logo_url, company_url, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Working experience updated!" });
    });
});

app.delete('/api/experience/:id', (req, res) => {
    const sql = "DELETE FROM working_experience WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Working experience deleted!" });
    });
});

// ==========================================
// EDUCATION APIs
// ==========================================
app.get('/api/education', (req, res) => {
    const sql = "SELECT * FROM education ORDER BY is_current DESC, start_date DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/education', upload.single('image'), (req, res) => {
    const { degree_course_name, institution_name, start_date, end_date, institution_url, description } = req.body;
    const is_current = req.body.is_current === 'true' || req.body.is_current === '1' || req.body.is_current === true ? 1 : 0;
    let logo_url = req.body.logo_url || '';
    if (req.file) {
        logo_url = `/uploads/${req.file.filename}`;
    }
    const sql = "INSERT INTO education (degree_course_name, institution_name, start_date, end_date, is_current, logo_url, institution_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [degree_course_name, institution_name, start_date, end_date, is_current, logo_url, institution_url, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Education added!", id: result.insertId });
    });
});

app.put('/api/education/:id', upload.single('image'), (req, res) => {
    const { degree_course_name, institution_name, start_date, end_date, institution_url, description } = req.body;
    const is_current = req.body.is_current === 'true' || req.body.is_current === '1' || req.body.is_current === true ? 1 : 0;
    let logo_url = req.body.logo_url || '';
    if (req.file) {
        logo_url = `/uploads/${req.file.filename}`;
    }
    const sql = "UPDATE education SET degree_course_name=?, institution_name=?, start_date=?, end_date=?, is_current=?, logo_url=?, institution_url=?, description=? WHERE id=?";
    db.query(sql, [degree_course_name, institution_name, start_date, end_date, is_current, logo_url, institution_url, description, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Education updated!" });
    });
});

app.delete('/api/education/:id', (req, res) => {
    const sql = "DELETE FROM education WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Education deleted!" });
    });
});
// ==========================================
// MESSAGES APIs
// ==========================================
app.post('/api/messages', (req, res) => {
    const { sender_name, sender_email, message } = req.body;
    const sql = "INSERT INTO messages (sender_name, sender_email, message) VALUES (?, ?, ?)";
    db.query(sql, [sender_name, sender_email, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Message sent!" });
    });
});

app.get('/api/messages', (req, res) => {
    const sql = "SELECT * FROM messages ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// ==========================================
// AUTHENTICATION (LOGIN) API
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admin WHERE username = ? AND password_hash = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            res.json({ success: true, message: "Login Successful" });
        } else {
            res.status(401).json({ success: false, message: "Username or Password incorrect" });
        }
    });
});

// ==========================================
// PROFILE APIs
// ==========================================
app.get('/api/profile', (req, res) => {
    const sql = "SELECT * FROM profile WHERE id = 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0] || {});
    });
});

app.put('/api/profile', upload.single('image'), (req, res) => {
    const { full_name, title, bio, email, github_link, linkedin_link, phone, address } = req.body;
    let profile_image_url = req.body.profile_image_url;
    if (req.file) {
        profile_image_url = `/uploads/${req.file.filename}`;
    }
    const sql = "UPDATE profile SET full_name=?, title=?, bio=?, profile_image_url=?, email=?, github_link=?, linkedin_link=?, phone=?, address=? WHERE id=1";
    db.query(sql, [full_name, title, bio, profile_image_url, email, github_link, linkedin_link, phone, address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated successfully!" });
    });
});

// ==========================================
// SKILLS APIs
// ==========================================
app.get('/api/skills', (req, res) => {
    const sql = "SELECT * FROM skills";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/skills', upload.single('image'), (req, res) => {
    const { name, main_category, sub_category, proficiency_text, proficiency_percentage } = req.body;
    const skill_logo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = "INSERT INTO skills (name, main_category, sub_category, proficiency_text, proficiency_percentage, skill_logo_url) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, main_category, sub_category, proficiency_text, proficiency_percentage || null, skill_logo_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Skill added!", id: result.insertId, skill_logo_url });
    });
});

app.put('/api/skills/:id', upload.single('image'), (req, res) => {
    const { name, main_category, sub_category, proficiency_text, proficiency_percentage } = req.body;
    let sql = "UPDATE skills SET name=?, main_category=?, sub_category=?, proficiency_text=?, proficiency_percentage=? WHERE id=?";
    let params = [name, main_category, sub_category, proficiency_text, proficiency_percentage || null, req.params.id];
    
    if (req.file) {
        sql = "UPDATE skills SET name=?, main_category=?, sub_category=?, proficiency_text=?, proficiency_percentage=?, skill_logo_url=? WHERE id=?";
        params = [name, main_category, sub_category, proficiency_text, proficiency_percentage || null, `/uploads/${req.file.filename}`, req.params.id];
    }
    
    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Skill updated successfully!" });
    });
});

app.delete('/api/skills/:id', (req, res) => {
    const sql = "DELETE FROM skills WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Skill deleted!" });
    });
});

// ==========================================
// CERTIFICATIONS APIs
// ==========================================
app.get('/api/certifications', (req, res) => {
    const sql = "SELECT * FROM certifications ORDER BY issue_date DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/certifications', upload.single('image'), (req, res) => {
    const { title, issuer, issue_date, credential_link } = req.body;
    let certificate_image_url = req.body.certificate_image_url;
    if (req.file) {
        certificate_image_url = `/uploads/${req.file.filename}`;
    }
    const sql = "INSERT INTO certifications (title, issuer, issue_date, credential_link, certificate_image_url) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, issuer, issue_date, credential_link, certificate_image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Certification added!", id: result.insertId });
    });
});

app.put('/api/certifications/:id', upload.single('image'), (req, res) => {
    const { title, issuer, issue_date, credential_link } = req.body;
    let certificate_image_url = req.body.certificate_image_url;
    if (req.file) {
        certificate_image_url = `/uploads/${req.file.filename}`;
    }
    const sql = "UPDATE certifications SET title=?, issuer=?, issue_date=?, credential_link=?, certificate_image_url=? WHERE id=?";
    db.query(sql, [title, issuer, issue_date, credential_link, certificate_image_url, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Certification updated successfully!" });
    });
});

app.delete('/api/certifications/:id', (req, res) => {
    const sql = "DELETE FROM certifications WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Certification deleted!" });
    });
});

// ==========================================
// SERVER LISTEN
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});