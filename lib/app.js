/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import request from 'superagent';
import { mungeSearch } from '../utils/munge-utils.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('Music Match API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

//get user scores
app.get('/api/scores', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT  s.id, cat1, cat2, cat3, total, 
              u.name AS "uName", user_id AS "userId"
      FROM    scores s
      JOIN    users u
      ON      s.user_id = u.id;
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/scores', async (req, res) => {
  // use SQL query to get data...
  try {
    const scores = req.body;
    const data = await client.query(`
      INSERT INTO scores    (cat1, cat2, cat3, total, u_name, user_id)
      VALUES   ($1, $2, $3, $4, $5, $6)
      RETURNING id, cat1, cat2, cat3, total, u_name AS "uName", user_id AS "userId";
    `, [scores.cat1, scores.cat2, scores.cat3, scores.total, scores.uName, req.userId]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scores/:id', async (req, res) => {
  try {
    const score = req.body;

    const data = await client.query(`
      UPDATE    scores
      SET       cat1 = $1, cat2 = $2, cat3 = $3, total = $4
      WHERE     id = $5
      AND       user_id = $6
      RETURNING id, cat1, cat2, cat3, total, u_name AS "uName", user_id AS "userId";
    `, [score.cat1, score.cat2, score.cat3, score.total, req.params.id, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/categories/:search', async (req, res) => {

  try {
    const response = await request
      .get(`https://itunes.apple.com/search?term=${req.query.search}&media=music&limit=1`);

    const jsonResponse = JSON.parse(response.text);

    const mungedData = mungeSearch(jsonResponse);
    res.json(mungedData);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;