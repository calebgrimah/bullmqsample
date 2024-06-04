// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from './email';
import Redis from "ioredis";
import {Cluster} from "node:cluster";

const connection = new IORedis(
    {
        port:6379,
        host: "127.0.0.1",
        username: "default",
        connectTimeout: 3000000,
        maxRetriesPerRequest: null
    }
);

const emailQueue = new Queue('email-queue', { connection });

const scheduler = new Queue('email-queue', { connection })
// BullModule.registerQueue({
//     name: BullQueues.NOTIFICATIONS,
//     createClient(
//         type: 'client' | 'subscriber' | 'bclient',
//         redisOpts?: RedisOptions,
//     ): Redis | Cluster {
//         return new Redis(, {
//             maxRetriesPerRequest: null,
//             enableReadyCheck: false,
//             showFriendlyErrorStack: true,
//         });
//     },
// });

const emailWorker = new Worker(
    'email-queue',
    async job => {
        const { to, subject, text } = job.data;
        await sendEmail(to, subject, text);
    },
    { connection }
);

emailWorker.on('completed', job => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
});

export const addEmailJob = async (to: string, subject: string, text: string) => {
    await emailQueue.add(
        'send-email',
        { to, subject, text },
        { repeat: { /*every: 5000 ,*/ limit: 5}
        }
    );
};

export default emailQueue;
