const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

// Define a function to generate a random OTP
function generateOTP() {
  // Implement your OTP generation logic here
  // For example, you can use a library like 'otp-generator'
  // Install it with: npm install otp-generator
  const otpGenerator = require('otp-generator');
  return otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
}

router.post("/sendemail", async (req, res) => {
  const FromEmail = process.env.MAIL_USERNAME;
  const Password = process.env.MAIL_PASSWORD;
  const { email, dairycode, username } = req.body; // Get the email address from req.body

  // Generate an OTP
  const otp = generateOTP();

  console.log(email);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: FromEmail,
      pass: Password,
    },
  });

  let mailOptions = {
    from: FromEmail,
    to: email, // Send the OTP to the provided email address
    subject: "Your Account Has Been Created!",
    html: `
    <html>

    <head>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    
    <body>
        <div class="bg-gray-100 p-8">
            <div class="bg-white shadow-lg p-6 rounded-lg  shadow-teal-400 border border-solid border-sky-600">
                <p class="text-lg font-semibold ">
                    પ્રિય ${username},</p>
                <p class="text-gray-600 mt-2">
                    તમારો ડેરી કોડ : ${dairycode},</p>
                <p class="text-lg mt-2">અમે તમને જણાવતા ઉત્સાહિત છીએ કે અમારી સેવા માટે તમારું એકાઉન્ટ સફળતાપૂર્વક બનાવવામાં
                    આવ્યું છે! તમે હવે લૉગ ઇન કરી શકો છો અને સેવાનો ઉપયોગ શરૂ કરી શકો છો.</p>
                <p class="text-lg bg-cyan-500 ring-2 rounded-xl mt-2 mb-2">Your OTP for verification is: <span
                        class=" text-2xl font-bold text-white ml-3">${otp}</span></p>
                <p class="text-lg mt-2">અમે અમારી સેવા વડે તમારા લક્ષ્યોને હાંસલ કરવામાં તમને મદદ કરવા માટે આતુર છીએ. અમને
                    પસંદ
                    કરવા બદલ આભાર!</p>
                <p class="text-lg mt-2">શ્રેષ્ઠ શુભેચ્છા,<br>ડાભી વિજય</p>
            </div>
        </div>
    </body>
    
    </html>
    
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
