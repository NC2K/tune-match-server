/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        avatar VARCHAR(512),
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE scores (
        id SERIAL PRIMARY KEY NOT NULL,
        cat1 VARCHAR(512) NOT NULL,
        cat2 VARCHAR(512),
        cat3 VARCHAR(512),
        total INTEGER NOT NULL,
        u_name VARCHAR(512),
        user_id INTEGER NOT NULL REFERENCES users(id)
        );
        `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}