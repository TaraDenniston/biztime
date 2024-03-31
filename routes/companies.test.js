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

describe('GET /companies', () => {
  test('Get list of companies', async () => {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      companies: [
        {
          code: "lily", 
          name: "Lily's Biscuits", 
          description: "Speedy biscuits since 2023"
        },
        {
          code: "bubba-gump", 
          name: "Bubba-Gump Shrimp", 
          description: "Finest shrimp in Louisiana"
        }
      ] 
    });
  })
})

describe('GET /companies/[code]', () => {
  test('Return company information', async () => {
    const res = await request(app).get('/companies/lily');
    expect(res.body).toEqual({
      company: {
        code: "lily",
        name: "Lily's Biscuits", 
        description: "Speedy biscuits since 2023",
        industries: [],
        invoices: [
          {
            add_date: "2024-01-01T05:00:00.000Z",
            amt: 100,
            comp_code: "lily",
            id: 1,
            paid: false,
            paid_date: null
          },
          {
            add_date: "2024-02-01T05:00:00.000Z",
            amt: 200,
            comp_code: "lily",
            id: 2,
            paid: true,
            paid_date: "2024-02-02T05:00:00.000Z"
          },
        ]
      }
    })
  })

  test('Return 404 status when company does not exist', async () => {
    const response = await request(app).get("/companies/fake-company");
    expect(response.status).toEqual(404);
  })
})

describe('POST /companies', () => {
  test('Create new company', async () => {
    const response = await request(app).post('/companies')
      .send({code: "new", name: 'New Company', description: 'Description of New Company'});
    expect(response.body).toEqual(
      {
        "company": {
          code: "new",
          name: "New Company",
          description: "Description of New Company"
        }
      }
    );
  })
})

describe('PUT /companies/[code]', () => {
  test('Edit a company', async () => {
    const response = await request(app).put('/companies/lily')
      .send({
        name: "Lily's Fast-Food Biscuits", 
        description: "Industrial-grade, speedy, four-paw biscuits"
      });
    expect(response.body).toEqual(
      {
        "company": {
          code: "lily",
          name: "Lily's Fast-Food Biscuits",
          description: "Industrial-grade, speedy, four-paw biscuits"
        }
      }
    );
  })
  test('Return 404 status when company does not exist', async () => {
    const response = await request(app).put("/companies/fake-company");
    expect(response.status).toEqual(404);
  })
})

describe('DELETE /companies/[code]', () => {
  test('Delete a company', async () => {
    const response = await request(app).delete('/companies/bubba-gump');
    expect(response.body).toEqual({"status": "deleted"});
  })
  test('Return 404 status when company does not exist', async () => {
    const response = await request(app).delete("/companies/fake-company");
    expect(response.status).toEqual(404);
  })
})