const db = require('../db');

async function createData() {
  await db.query(`DELETE FROM companies`);
  await db.query(`DELETE FROM invoices`);
  await db.query(`SELECT setval('invoices_id_seq', 1, false)`);

  await db.query(`INSERT INTO companies (code, name, description)
                  VALUES  ('lily', 'Lily''s Biscuits', 'Speedy biscuits since 2023'),
                          ('bubba-gump', 'Bubba-Gump Shrimp', 'Finest shrimp in Louisiana')`);

  await db.query(`INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
                  VALUES  ('lily', 100, false, '2024-01-01', null),
                          ('lily', 200, true, '2024-02-01', '2024-02-02'), 
                          ('bubba-gump', 300, false, '2024-03-01', null)`);
}

module.exports = { createData };