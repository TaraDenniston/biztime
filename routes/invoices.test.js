process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

const { createData } = require('./test-data');
const Test = require('supertest/lib/test');


beforeEach(createData);

afterAll(async () => {
  await db.end()
})


describe('GET /invoices', () => {
  test('Get list of invoices', async () => {
    const res = await request(app).get('/invoices');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      invoices: [
        {
          id: 1,
          comp_code: "lily", 
          amt: 100, 
          paid: false,
          add_date: "2024-01-01T05:00:00.000Z", 
          paid_date: null
        },
        {
          id: 2,
          comp_code: "lily", 
          amt: 200, 
          paid: true,
          add_date: "2024-02-01T05:00:00.000Z", 
          paid_date: "2024-02-02T05:00:00.000Z"
        },
        {
          id: 3,
          comp_code: "bubba-gump", 
          amt: 300, 
          paid: false,
          add_date: "2024-03-01T05:00:00.000Z", 
          paid_date: null
        }
      ] 
    });
  })
})