// lib/email.ts
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    const info = await transporter.sendMail({
        from: 'king@gmail.com', // Replace with your sender name and email
        to,
        subject,
        text,
    });

    console.log('Message sent: %s', info.messageId);
};
