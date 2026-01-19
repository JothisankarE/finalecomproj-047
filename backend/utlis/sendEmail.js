const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = async (email, confirmationUrl) => {
    let transporter;

    // If SMTP credentials are provided, use them. Otherwise fall back to ethereal test account.
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // create a test account (ethereal) for development if real SMTP not configured
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const mailOptions = {
        from: process.env.SMTP_USER || 'no-reply@example.com',
        to: email,
        subject: 'Account Confirmation',
        text: `Please confirm your account by clicking the link: ${confirmationUrl}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        // If using ethereal, log the preview URL for development
        if (nodemailer.getTestMessageUrl && info) {
            const preview = nodemailer.getTestMessageUrl(info);
            if (preview) console.log('Preview URL: %s', preview);
        }
    } catch (err) {
        console.log('sendConfirmationEmail error:', err);
        throw err;
    }
};
