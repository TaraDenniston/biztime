/** Routes for /industries */

const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res, next) => {
  try {
    // Get all industries and related companies
    const indResults = await db.query(`SELECT * FROM industries`);
    const industries = indResults.rows;
    const compResults = await db.query(`SELECT * from companies_industries`);
    const indCompanies = compResults.rows;

    // Add company codes to each industry
    industries.map( item => {
      item.companies = [];
      indCompanies.map( c => {
        if (item.code === c.ind_code) {
          item.companies.push(c.comp_code);
        }
      });
    });

    return res.json({ industries: industries })
  } catch (e) {
    return next(e);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const results = await db.query(`INSERT INTO industries (code, 
      industry) VALUES ($1, $2) RETURNING code, industry`, 
      [code, industry]);
    return res.status(201).json({ industry: results.rows[0] });
  } catch (e) {
    return next(e);
  }
})

router.post('/:code', async (req, res, next) => {
  try {
    const indCode = req.params.code;
    const compCode = req.body.comp_code;
    const industry = await db.query (`SELECT * FROM industries
      WHERE code=$1`, [indCode])
    if (industry.rows.length === 0) {
      throw new ExpressError(`Industry Code '${indCode}' does not exist`, 404);
    }
    const results = await db.query(`INSERT INTO companies_industries 
      (comp_code, ind_code) VALUES ($1, $2) RETURNING comp_code`, 
      [compCode, indCode]);
    return res.status(201).json({ added: results.rows[0] });
  } catch (e) {
    return next(e);
  }
})


module.exports = router;