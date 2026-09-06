const db = require('./db');

const sql = `
  CREATE TABLE IF NOT EXISTS working_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current TINYINT(1) DEFAULT 0,
    company_logo_url VARCHAR(255) DEFAULT NULL
  );
`;

db.query(sql, (err, result) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Created working_experience table successfully');
    
    const seedSql = `
      INSERT INTO working_experience (position, company_name, start_date, end_date, is_current, company_logo_url)
      VALUES 
      ('IT Assistant', 'MR/Deniyaya Central College, Deniyaya', '2018', '2023', 0, ''),
      ('Gallery Assistant Manager', 'Millennium Art Contemporary (MIAC), Millennium City, Oruwala', '2025', '', 1, '')
    `;
    db.query(seedSql, (seedErr) => {
      if(seedErr) console.error(seedErr);
      else console.log('Seeded sample data successfully!');
      process.exit();
    });
  }
});
