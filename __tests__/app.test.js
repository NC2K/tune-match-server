import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/scores', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          avatar: 'image',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;

    });

    // append the token to your requests:
    //  .set('Authorization', user.token);

    let scores = [
      {
        id: expect.any(Number),
        cat1: 'swing',
        cat2: '1990s',
        cat3: 'film score',
        total: 19387234
      },
      {
        id: expect.any(Number),
        cat1: 'EDM',
        cat2: 'Alternative',
        cat3: 'Jazz',
        total: 239580
      },
      {
        id: expect.any(Number),
        cat1: 'Serf Rock',
        cat2: 'Country',
        cat3: '1980s',
        total: 1872460
      }
    ];

    let search = [
      {
        title: 'You Get What You Give',
        artist: 'New Radicals',
        song: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview71/v4/ab/0c/d5/ab0cd56a-b042-5132-fd70-0a6b6826f5bf/mzaf_6259006033703974886.plus.aac.p.m4a',
        albumArt: 'https://is5-ssl.mzstatic.com/image/thumb/Music/v4/9f/99/07/9f990707-cf0c-9275-334d-a4d0f5522d2c/source/60x60bb.jpg',
        genre: 'Pop'
      }
    ];

    it('POST scores to /api/scores', async () => {
      const response = await request
        .post('/api/scores')
        .set('Authorization', user.token)
        .send(scores[0]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...scores[0], userId: user.id });

      //scores = response.body;
    });

    it('GET scores from /api/scores', async () => {

      const response1 = await request
        .post('/api/scores')
        .set('Authorization', user.token)
        .send(scores[1]);

      const response2 = await request
        .post('/api/scores')
        .set('Authorization', user.token)
        .send(scores[2]);

      const response = await request
        .get('/api/scores')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response1.body).toEqual({ ...scores[1], userId: user.id });
      expect(response2.body).toEqual({ ...scores[2], userId: user.id });
      expect(response.body).toEqual([
        { ...scores[0], userId: user.id },
        { ...scores[1], userId: user.id },
        { ...scores[2], userId: user.id }]);
    });

    it('GET album from /api/categories/:search', async() => {
      const response = await request
        .get('/categories/search?term=NOW+90\'s')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(response.body);
    });



  });
});