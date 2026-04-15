const nodemailer=require('nodemailer')

exports.sendCongratulationsMail = async (userEmail, userName, blogTitle) => {
  try {
    // transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS    // app password
      }
    });

    // email content
    const mailOptions = {
      from: `"Blog Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎉 Congratulations! Your Blog is Published",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>🎉 Congratulations ${userName}!</h2>
          
          <p>Your blog has been successfully published.</p>
          
          <h3 style="color: green;">"${blogTitle}"</h3>
          
          <p>Now everyone can read your amazing content 🚀</p>
          
          <br/>
          <p>Keep writing and sharing knowledge!</p>
          
          <hr/>
          <p>Regards,<br/>Blog Team</p>
        </div>
      `
    };

    // send mail
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

  } catch (error) {
    console.error("Email sending failed:", error);
  }
};