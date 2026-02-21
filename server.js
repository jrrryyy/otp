const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Transporter optimized for cloud network timeouts
const transporter = nodemailer.createTransport({
    pool: true, // Keeps connection open for better stability
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    // Fixes for the "Connection Timeout" error
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000,
    socketTimeout: 30000,
    tls: {
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

// Render dynamic port binding
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
