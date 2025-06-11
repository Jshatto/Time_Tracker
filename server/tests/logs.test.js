const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

jest.mock('../models/Log', () => ({
  create: jest.fn(),
  find: jest.fn(),
  deleteMany: jest.fn(),
}));

const app = require('../index');
const Log = require('../models/Log');

beforeAll(async () => {
  jest.spyOn(mongoose, 'connect').mockResolvedValue();
  jest.spyOn(mongoose, 'disconnect').mockResolvedValue();
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.disconnect();
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/logs', () => {
  it('creates a log with valid input', async () => {
    Log.create.mockResolvedValue({ _id: '1', userId: 'user1', message: 'test message' });

    const res = await request(app)
      .post('/api/logs')
      .send({ userId: 'user1', message: 'test message' });

    expect(res.statusCode).toBe(201);
    expect(Log.create).toHaveBeenCalledWith({ userId: 'user1', message: 'test message' });
  });

  it('returns 400 for invalid input', async () => {
    const res = await request(app).post('/api/logs').send({ userId: 'user1' });
    expect(res.statusCode).toBe(400);
    expect(Log.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/logs/:userId', () => {
  it('returns an array of logs', async () => {
    Log.find.mockResolvedValue([{ _id: '1', userId: 'user1', message: 'one' }]);

    const res = await request(app).get('/api/logs/user1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(Log.find).toHaveBeenCalledWith({ userId: 'user1' });
  });
});