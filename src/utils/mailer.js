import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `${process.env.FROM_NAME || 'Helplytics Admin'} <${process.env.FROM_EMAIL || 'noreply@helplytics.ai'}>`,
        to: options.email,
        subject: options.subject,
        html: `
            <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
                <div style="max-width:520px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.1);">

                    <h2 style="color:#333; margin-bottom:5px;">
                        Hey ${options.name || "there"} 👋
                    </h2>

                    <p style="color:#666; font-size:14px;">
                        Use this OTP to verify your account. It’s valid for <b>5 minutes</b>.
                    </p>

                    <div style="margin:25px 0;">
                        <span style="
                            display:inline-block;
                            font-size:30px;
                            letter-spacing:10px;
                            font-weight:bold;
                            background:#111827;
                            color:#fff;
                            padding:14px 28px;
                            border-radius:10px;
                        ">
                            ${options.otp || options.message || "------"}
                        </span>
                    </div>

                    <p style="color:#999; font-size:12px;">
                        If you didn’t request this, you can safely ignore this email.
                    </p>

                    <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">

                    <p style="font-size:12px; color:#aaa;">
                        © ${new Date().getFullYear()} ${process.env.FROM_NAME || "Helplytics AI"}
                    </p>

                </div>
            </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
};
