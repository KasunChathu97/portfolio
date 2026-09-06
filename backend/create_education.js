const db = require('./db');

const sql = `
  CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_course_name VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current TINYINT(1) DEFAULT 0,
    logo_url VARCHAR(255) DEFAULT NULL,
    institution_url VARCHAR(255) DEFAULT NULL,
    description TEXT
  );
`;

db.query(sql, (err, result) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Created education table successfully');
    
    const seedSql = `
      INSERT INTO education (degree_course_name, institution_name, start_date, end_date, is_current, description)
      VALUES 
      ('BSc in Information Technology', 'SIBA Campus', '2023', '', 1, ''),
      ('G.C.E. Advance Level', 'MR/Pallegama Secondary School', '2017', '2017', 0, 'Obtained 1 C pass and 1 S pass, including an A pass for Accounting.')
    `;
    db.query(seedSql, (seedErr) => {
      if(seedErr) console.error(seedErr);
      else console.log('Seeded sample data successfully!');
      process.exit();
    });
  }
});
