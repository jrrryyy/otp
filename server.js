const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Configure the Email Sender
// Updated transporter for Render stability
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Changed from 465 to 587
    secure: false, // Must be false for port 587
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Helps with network reachability
    }
});

// 2. Create the Endpoint your Android App will call
app.post('/send-otp', (req, res) => {
    const { email, otpCode } = req.body;

    const mailOptions = {
        from: '"FlameEase Support" <your-email@gmail.com>',
        to: email,
        subject: 'FlameEase Password Reset Code',
        text: `Your 6-digit verification code is: ${otpCode}. Please enter this in the app to reset your password.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error sending email");
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send("Email Sent Successfully");
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');

});
