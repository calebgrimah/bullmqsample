// pages/api/schedule-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {addEmailJob} from "@/lib/queue";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;
        try {
            await addEmailJob("caleb@eh.com", "sample subject", "sample email text");
            res.status(200).json({ message: 'Email scheduled successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to schedule email', error });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
