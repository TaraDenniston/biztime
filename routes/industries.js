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


module.exports = router;