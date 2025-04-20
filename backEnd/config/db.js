const { Pool } = require('pg');
const net = require('net');
const { URL } = require('url');

// Parse connection string
const dbUrl = new URL(process.env.DATABASE_URL);
const config = {
  user: dbUrl.username,
  password: dbUrl.password,
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 5432,
  database: dbUrl.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false,
    servername: dbUrl.hostname
  },
  // Connection settings
  connectionTimeoutMillis: 30000,
  // Pool settings
  max: 1, // Start with single connection
  idleTimeoutMillis: 30000
};

const pool = new Pool(config);

// Enhanced connection test
const connectDB = async () => {
  // First test raw TCP connection
  await new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: config.host,
      port: config.port,
      timeout: 10000
    });

    socket.on('connect', () => {
      socket.destroy();
      resolve();
    });

    socket.on('error', reject);
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('TCP connection timeout'));
    });
  });

  // Then connect with pg
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return client;
  } finally {
    client.release();
  }
};

module.exports = { pool, connectDB };