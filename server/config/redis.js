const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '192.168.0.7';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redis';

const redis = require('redis');
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

redisClient.auth(REDIS_PASSWORD, err => {
  if (err) throw err;
});

redisClient.on('error', err => {
  console.log('Redis error: ' + err);
});

redisClient.on('ready', () => {
  console.log('redis connection');
});

module.exports = redisClient;
