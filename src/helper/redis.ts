import getConfig from 'next/config';
import { createClient } from 'redis';

const { serverRuntimeConfig } = getConfig();
const redis = createClient({
  socket: {
    host: serverRuntimeConfig.redisHost,
    port: serverRuntimeConfig.redisPort,
    keepAlive: false,
  },
  database: serverRuntimeConfig.redisDb,
  password: serverRuntimeConfig.redisPassword,
});

redis.connect();

redis.on('error', (err) => {
  console.log(`Failed to connect Redis server Error: ${err}`);
  redis.disconnect();
  // eslint-disable-next-line no-undef
  setTimeout(() => {
    console.log('reconnecting to redis');
    redis.connect();
  }, 5000);
});

redis.on('ready', () => {
  console.log('redis connected');
});

export { redis };
