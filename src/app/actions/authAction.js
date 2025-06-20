"use server";
import { mailOptions, transporter } from "@/config/nodemailer";
import { login, register, submitOtp, verifyOtp } from "@/services/inventory";
export const loginAction = async (prevState, formData) => {
  if (!formData) return prevState;

  const result = await login(formData);
  return result;
};

export const registerAction = async (prevState, formData) => {
  if (!formData) return prevState;

  const result = await register(formData);

  return result;
};

export const mailSendingAction = async (prevState, email, otp) => {
  if (!email) return prevState;

  try {
    const res = await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: "Reset Password",
      text: `Your OTP for reset password is ${otp}`,
      html: `<p>Your OTP for reset password is <strong>${otp}</strong>. Do not share this OTP with anyone.</p>`,
    });

    if (Array.isArray(res.accepted) && res.accepted.length > 0) {
      return { success: true, message: "Email sent successfully" };
    } else {
      return { success: false, message: "Email not sent" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send password reset email",
      error: error.message || String(error),
    };
  }
};

export const otpVerificationAction = async (prevState, otp) => {
  if (!otp) return prevState;

  const result = await verifyOtp({ otp });
  return await result;
};

export const submitOtpAction = async (prevState, formData) => {
  if (!formData) return prevState;

  const result = await submitOtp(formData);
  return result;
};
