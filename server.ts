import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON body
  app.use(express.json());

  // Wait to initialize resend until we use it to prevent crashing if key is missing
  let resendClient: Resend | null = null;
  function getResend() {
    if (!resendClient) {
      const key = process.env.RESEND_API_KEY;
      if (!key) {
        throw new Error("RESEND_API_KEY environment variable is missing.");
      }
      resendClient = new Resend(key);
    }
    return resendClient;
  }

  // API Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, subject, body } = req.body;

      if (!firstName || !lastName || !subject || !body) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // If no key is set yet, we simulate success so the UI works, but note the error
      if (!process.env.RESEND_API_KEY) {
        console.warn("Simulated email send. Please set RESEND_API_KEY in the settings to send real emails.");
        return res.status(200).json({ success: true, simulated: true });
      }

      const resend = getResend();
      
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>", // Replace with your verified domain when going to production
        to: ["carmanear@outlook.com"],
        subject: `New band inquiry: ${subject}`,
        html: `
          <h3>New Website Message</h3>
          <p><strong>From:</strong> ${firstName} ${lastName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${body.replace(/\n/g, '<br/>')}</p>
        `,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ success: true, data });
    } catch (err: any) {
      console.error("Error sending email:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
