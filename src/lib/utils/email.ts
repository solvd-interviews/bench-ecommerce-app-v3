// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendEmail(
  to?: string,
  subject?: string,
  text?: string,
  html?: string
) {
  const msg = {
    to: "qatraining@solvd.com", // Change to your recipient
    from: "qatraining@solvd.com", // Change to your verified sender
    subject: "Email confirmation code",
    text: "Your confirmation code is: 32132",
  };
  try {
    const res = await sgMail.send({
      to: "qatraining@solvd.com", // Change to your recipient
      from: "qatraining@solvd.com", // Change to your verified sender
      subject: "Email confirmation code",
      text: "Your confirmation code is: 32132",
    });
    console.log("The response sending email is: ", res);
  } catch (error) {
    console.log("The error sending email is: ", JSON.stringify(error));
  }
}
