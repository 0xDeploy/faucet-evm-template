import Redis from "ioredis";

/*
 * connect to the redis server
 * Redis is a key-value store that is used to store data in memory.
 * Key value will be address => timestamp of last faucet request
 */
const redis = new Redis(process.env.REDIS_URI as string);

export default redis;
