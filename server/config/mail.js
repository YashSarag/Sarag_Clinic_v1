const nodemailer = require('nodemailer');
require('dotenv').config()


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true only for port 465
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});


const sendMail = async(email, subject, body) => {
    try{
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: body
        });

        return info;
    }catch(err){
        console.log("ERROR WHILE SENDING THE MAIL");
        throw err;
    }
}

module.exports = sendMail;