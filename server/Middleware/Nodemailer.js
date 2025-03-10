import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  ort: 587,
  secure: false,
  auth: {
    user: "marudhutravellog@gmail.com",
    pass: "obef gdlq wday lfif",
  },
});

export const sentOtp = async (email, otp) => {
  const mailOptions = {
    from: "marudhutravellog@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  try {
    const details = await transport.sendMail(mailOptions);
    // console.log("OTP sent successfully:", details.response);
    return details;
  } catch (error) {
    // console.log(error);
    throw new Error("Failed to send OTP");
  }
};
