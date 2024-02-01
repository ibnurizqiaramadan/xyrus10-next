/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisDb: process.env.REDIS_DB,
    redisPassword: process.env.REDIS_PASS,
    ytDlPath: process.env.YT_DLPATH,
  },
};

module.exports = nextConfig;
