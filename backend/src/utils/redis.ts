import {Redis} from "@upstash/redis";
const client=new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
})
export default client;