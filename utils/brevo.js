const BrevoClient = require("@getbrevo/brevo");

const brevoClient = new BrevoClient.TransactionalEmailsApi()
brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.BERVO_API_KEY);

const brevo = async (userEmail, username, html) => {
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
   
    await brevoClient.sendTransacEmail(sendSmtpEmail);
}

module.exports = {brevo}