const nodemailer = require('nodemailer');

const createTransporter = async () => {
    // If SMTP credentials are provided, use them. Otherwise fall back to ethereal test account.
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // create a test account (ethereal) for development if real SMTP not configured
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
};

exports.sendConfirmationEmail = async (email, confirmationUrl) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Kathithimalai Textile'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Account Confirmation',
        text: `Please confirm your account by clicking the link: ${confirmationUrl}`,
        html: `<p>Please confirm your account by clicking the link: <a href="${confirmationUrl}">${confirmationUrl}</a></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (process.env.SMTP_USER === '' && info) {
            const preview = nodemailer.getTestMessageUrl(info);
            if (preview) console.log('Preview URL: %s', preview);
        }
    } catch (err) {
        console.log('sendConfirmationEmail error:', err);
        throw err;
    }
};

exports.sendContactFormEmail = async (formData) => {
    const transporter = await createTransporter();
    const { firstName, lastName, email, phone, countryCode, services, message, rating } = formData;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Kathithimalai Textile'}" <${process.env.SMTP_USER}>`,
        to: 'jothisankar979@gmail.com',
        subject: `New Contact Form Submission from ${firstName} ${lastName}`,
        html: `
            <h2>New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
            <p><strong>Services Interested:</strong> ${Array.isArray(services) ? services.join(', ') : services}</p>
            <p><strong>Experience Rating:</strong> ${rating} / 5 ⭐</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log('sendContactFormEmail error:', err);
        throw err;
    }
};
