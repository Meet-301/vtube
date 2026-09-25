import crypto from "crypto";

const sendEmail = async ({ to, subject, html }) => {

    const response = await fetch(
        `https://api.us.nylas.com/v3/domains/${process.env.NYLAS_DOMAIN}/messages/send`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
                "Content-Type": "application/json",

                //! Prevent duplicate emails if the request is safely retried
                "Idempotency-Key": crypto.randomUUID(),
            },

            body: JSON.stringify({
                to: [
                    {
                        email: to,
                    },
                ],

                from: {
                    name: "VTube",
                    email: process.env.NYLAS_FROM_EMAIL,
                },

                subject,

                body: html,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.error?.message ||
            "Failed to send email"
        );
    }

    return result;
};

export default sendEmail;