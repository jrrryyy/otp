const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Transporter with "Pool" enabled for unstable cloud networks
const transporter = nodemailer.createTransport({
    pool: true, 
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL for port 465
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        // These settings are critical to fix the ENETUNREACH error
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
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
