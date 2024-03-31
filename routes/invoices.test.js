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

describe('GET /invoices/[id]', () => {
  test('Return details for a specific invoice', async () => {
    const res = await request(app).get('/invoices/1');
    expect(res.body).toEqual({
      invoice: {
        id: 1,
        amt: 100, 
        paid: false,
        add_date: "2024-01-01T05:00:00.000Z", 
        paid_date: null,
        company: {
          code: "lily",
          description: "Speedy biscuits since 2023",
          name: "Lily's Biscuits"
        }
      }
    })
  })
  test('Return 404 status when invoice does not exist', async () => {
    const response = await request(app).get("/invoices/99");
    expect(response.status).toEqual(404);
  })
})

describe('POST /invoices', () => {
  test('Create new invoice', async () => {
    const response = await request(app).post('/invoices')
      .send({comp_code: "bubba-gump", amt: 100});
    expect(response.body).toEqual(
      {
        invoice: {
          id: 4,
          comp_code: "bubba-gump",
          amt: 100,
          paid: false,
          add_date: expect.any(String),
          paid_date: null,
        }
      }
    );
  })
})

describe('PUT /invoices/[id]', () => {
  test('Edit an invoice', async () => {
    const response = await request(app).put('/invoices/3')
      .send({amt: "500", id: 3});
    expect(response.body).toEqual(
      {
        invoice: {
          id: 3,
          comp_code: "bubba-gump",
          amt: 500,
          paid: false,
          add_date: expect.any(String),
          paid_date: null,
        }
      }
    );
  })
  test('Return 404 status when invoice does not exist', async () => {
    const response = await request(app).put("/invoices/99");
    expect(response.status).toEqual(404);
  })
})

describe('DELETE /invoices/[id]', () => {
  test('Delete an invoice', async () => {
    const response = await request(app).delete('/invoices/2');
    expect(response.body).toEqual({status: "deleted"});
  })
  test('Return 404 status when invoice does not exist', async () => {
    const response = await request(app).delete("/invoices/99");
    expect(response.status).toEqual(404);
  })
})