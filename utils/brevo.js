const BrevoClient = require("@getbrevo/brevo");

const brevoClient = new BrevoClient.TransactionalEmailsApi()
brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.BERVO_API_KEY);

const brevo = async (userEmail, username, html) => {
    if (!process.env.BERVO_API_KEY || !process.env.SMTP_EMAIL) {
        const error = new Error("Email service is not configured")
        error.code = "EMAIL_DELIVERY_FAILED"
        throw error
    }

    const sendSmtpEmail = new BrevoClient.SendSmtpEmail()
    const data = {
        htmlContent: `<html><head></head><body><p>Hello ${username} ,</p>Welcome to backend!.</p></body></html>`,
        sender: {
            email: process.env.SMTP_EMAIL,
            name: "PrimePress Laundary",
        },
        subject: "Hello from PrimePress Laundary!",
    };
    sendSmtpEmail.to = [{
        email: userEmail
    }] 
    sendSmtpEmail.subject = data.subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.sender = data.sender
   
    try {
        await brevoClient.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        const message = error.code === "ETIMEDOUT"
            ? "Email service timed out"
            : error.response?.body?.message || error.response?.text || "Email service failed"

        const deliveryError = new Error(message)
        deliveryError.code = "EMAIL_DELIVERY_FAILED"
        deliveryError.cause = error
        throw deliveryError
    }
}

module.exports = {brevo}
