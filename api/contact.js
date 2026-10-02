import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["rahulde937@gmail.com"],
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,

      html: `
        <h2>New Portfolio Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to send email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
