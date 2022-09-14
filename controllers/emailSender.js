const sgMail = require("@sendgrid/mail");

const sendEmail = async (recipientMail, username) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: recipientMail,
    from: "diegoleonmedina62@gmail.com",
    subject: "Welcome to Disney Api for Alkemy",
    html: `<h1 id="welcome-to-disney-api">Welcome to Disney API for Alkemy</h1>
    <h2 id="for-alkemy-by-diego-medina">by Diego Medina</h2>
    <p> Hello ${username}. Thanks for using the Disney API</p>
    <h2 id="check-out-the-documentation-">Check out the Documentation:</h2>
    <ul>
    <li>you can check the postman documentation here:
    <a href="https://documenter.getpostman.com/view/21116120/2s7YYr8jqd">https://documenter.getpostman.com/view/21116120/2s7YYr8jqd</a></li>
    </ul>
    <p>Enjoy using the API!</p><p>Diego</p>
    `,
  };

  const mailInfo = await sgMail.send(msg);
  let mailsent = false;
  if (mailInfo[0].statusCode == 202) {
    mailsent = true;
  }
  return mailsent;
};

module.exports = sendEmail;
