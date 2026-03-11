import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for Proposal Approval
  app.post("/api/approve-proposal", async (req, res) => {
    const { razaoSocial, cnpj, endereco, cidadeUf, responsavel, cargo } = req.body;

    // Validate required fields
    if (!razaoSocial || !cnpj || !responsavel) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    // Configure Nodemailer
    // Note: The user will need to provide these in their environment settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "gomesdocarmo@gmail.com",
      subject: `Nova Proposta Aprovada: ${razaoSocial}`,
      text: `
        Uma nova proposta foi aprovada pelo cliente.
        
        Dados do Cliente:
        - Razão Social: ${razaoSocial}
        - CNPJ: ${cnpj}
        - Endereço: ${endereco}
        - Cidade/UF: ${cidadeUf}
        - Responsável: ${responsavel}
        - Cargo: ${cargo}
        
        Data: ${new Date().toLocaleString("pt-BR")}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6366f1;">Nova Proposta Aprovada</h2>
          <p>Uma nova proposta foi aprovada pelo cliente através do site.</p>
          <hr />
          <p><strong>Dados do Cliente:</strong></p>
          <ul>
            <li><strong>Razão Social:</strong> ${razaoSocial}</li>
            <li><strong>CNPJ:</strong> ${cnpj}</li>
            <li><strong>Endereço:</strong> ${endereco}</li>
            <li><strong>Cidade/UF:</strong> ${cidadeUf}</li>
            <li><strong>Responsável:</strong> ${responsavel}</li>
            <li><strong>Cargo:</strong> ${cargo}</li>
          </ul>
          <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Email not sent.");
        return res.status(200).json({
          success: true,
          message: "Proposta aprovada localmente (SMTP não configurado).",
          data: req.body
        });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Email enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).json({ error: "Erro ao enviar email de notificação." });
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
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
