require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected successfully');
    await client.end();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();