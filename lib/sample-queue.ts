import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import {sendEmail} from "@/lib/email";
const connection = new Redis(process.env.REDIS_URL!);

export const sampleQueue = new Queue('sampleQueue', {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
    },
});

const emailWorker = new Worker(
    'email-queue',
    async job => {
        const { to, subject, text } = job.data;
        await sendEmail(to, subject, text);
    },
    { connection }
)

const worker = new Worker(
    'sampleQueue', // this is the queue name, the first string parameter we provided for Queue()
    async (job) => {
        const data = job?.data;
        console.log(data);
        console.log('Task executed successfully');
    },
    {
        connection,
        concurrency: 5,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
    }
);

export default emailWorker;