/** Routes for /invoices */

const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
  } catch (e) {
    return next(e);
  }
})

// router.get('/:id', async (req, res, next) => {
//   try {

//   } catch (e) {
//     return next(e);
//   }
// })

// router.post('/', async (req, res, next) => {
//   try {

//   } catch (e) {
//     return next(e);
//   }
// })

// router.put('/:id', async (req, res, next) => {
//   try {

//   } catch (e) {
//     return next(e);
//   }
// })

// router.delete('/:id', async (req, res, next) => {
//   try {

//   } catch (e) {
//     return next(e);
//   }
// })

module.exports = router;