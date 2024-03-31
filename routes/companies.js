/** Routes for /companies */

const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows })
  } catch (e) {
    return next(e);
  }
})

router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Get data on company, including related industries and invoices
    const compResults = await db.query(`SELECT code, name, description 
      FROM companies WHERE code = $1`, [code]);
    if (compResults.rows.length === 0) {
      throw new ExpressError(`Code '${code}' does not exist`, 404);
    }
    const invResults = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [code]);
    const indResults = await db.query(`SELECT ind_code FROM companies_industries WHERE comp_code=$1`, [code]);
    const indArr = indResults.rows.map(ind => ind.ind_code);
    const indNames = await db.query(`SELECT industry FROM industries WHERE code = any($1)`, [indArr]);

    // Format response to return
    const company = compResults.rows[0];
    company.industries = indNames.rows.map( ind => ind.industry);
    company.invoices = invResults.rows.map( inv => {
      invObject = {
        id: inv.id, 
        comp_code: inv.comp_code, 
        amt: inv.amt, 
        paid: inv.paid, 
        add_date: inv.add_date, 
        paid_date: inv.paid_date
      }
      return invObject;
    })

    return res.json({ company: company });
  } catch (e) {
    return next(e);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const results = await db.query(`INSERT INTO companies (code, name, 
      description) VALUES ($1, $2, $3) RETURNING code, name, description`, 
      [code, name, description]);
    return res.status(201).json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
})

router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    const results = await db.query(`UPDATE companies SET name=$1, 
      description=$2 WHERE code=$3 RETURNING code, name, description`, 
      [name, description, code]);
    if (results.rows.length === 0) {
      throw new ExpressError(`Code '${code}' does not exist`, 404);
    }
    return res.json({ company: results.rows[0] })
  } catch (e) {
    return next(e);
  }
})

router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
    if (company.rows.length === 0) {
      throw new ExpressError(`Code '${code}' does not exist`, 404);
    }
    const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
    return res.send({ status: 'deleted' });
  } catch (e) {
    return next(e);
  }
})

module.exports = router;