/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import scores from './scores.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, avatar, email, hash)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `,
          [user.name, user.avatar, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      scores.map(score => {
        return client.query(`
        INSERT INTO scores (cat1, cat2, cat3, total, user_id)
        VALUES ($1, $2, $3, $4, $5)
        `,
          [score.cat1, score.cat2, score.cat3, score.total, user.id]);
      })
    );


    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}