const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Optimized Transporter for Cloud Hosting
const transporter = nodemailer.createTransport({
    pool: true, // keeps the connection open for faster sending
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL for port 465
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        // Essential to bypass the "Network Unreachable" error on Render
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com'
    }
});

app.post('/send-otp', (req, res) => {
    const { email, otpCode } = req.body;

    const mailOptions = {
        from: '"FlameEase Support" <flamease.config@gmail.com>',
        to: email,
        subject: 'FlameEase Password Reset Code',
        text: `Your 6-digit verification code is: ${otpCode}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Detailed Error:", error);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).send("Email Sent Successfully");
    });
});

// CRITICAL: Render needs to bind to process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
