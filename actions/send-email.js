"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    const data = await resend.emails.send({
      from: "Fianace Tracker <onboarding@resend.dev>",
      to: to,
      subject: subject,
      react: react,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, error };
  }
}
