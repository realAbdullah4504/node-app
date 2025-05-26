const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        auth: {
            user: "resend",
            pass: "re_PQZx1JMM_9vsedK2PHDjHwByrvgKEmm5p",
        },
    });

    try {
        const info = await transporter.sendMail({
            from: "zindy@telehunt.co",
            to,
            subject,
            html,
        });
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
module.exports = sendMail;