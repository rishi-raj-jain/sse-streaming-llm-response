// File: app/lib/upstashCache.tsx

import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";

// See https://docs.upstash.com/redis/howto/connectwithupstashredis#quick-start for connection options
export default new UpstashRedisCache({
  config: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
});
