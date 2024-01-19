const otpGenerator = require("otp-generator");

function generateOtp() {
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return otp
}

module.exports ={
    generateOtp
}