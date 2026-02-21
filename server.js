const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Configure the Email Sender
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.EMAIL, 
        pass: process.env.APP_PASSWORD   // Your Google "App Password" (NOT your login password)
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