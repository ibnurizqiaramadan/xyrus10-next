/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisDb: process.env.REDIS_DB,
    redisPassword: process.env.REDIS_PASS,
  },
};

module.exports = nextConfig;
