export type SubmissionNotificationPayload = {
  documentId?: string;
  titre: string;
  type: string;
  etablissement: string;
  filiere: string;
  ue: string;
  annee: string;
  niveau: string;
  session?: string | null;
  fileName?: string;
};

export type BrevoConfig = {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  adminEmail: string;
  appUrl?: string;
};

export function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !senderEmail || !adminEmail) {
    return null;
  }

  if (apiKey.startsWith("xsmtpsib-")) {
    throw new Error(
      "BREVO_API_KEY est une clé SMTP (xsmtpsib-). Utilisez une clé API v3 (xkeysib-) depuis Brevo → SMTP & API → Clés API.",
    );
  }

  if (!apiKey.startsWith("xkeysib-")) {
    throw new Error(
      "BREVO_API_KEY invalide : attendue une clé API v3 commençant par xkeysib-.",
    );
  }

  return {
    apiKey,
    senderEmail,
    senderName: (process.env.BREVO_SENDER_NAME || "Banque Epreuve").trim(),
    adminEmail,
    appUrl: (
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).trim(),
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSubmissionEmailHtml(
  payload: SubmissionNotificationPayload,
  config: BrevoConfig,
) {
  const adminLink = `${config.appUrl?.replace(/\/$/, "")}/admin/documents`;
  const rows = [
    ["Titre", payload.titre],
    ["Type", payload.type],
    ["Établissement", payload.etablissement],
    ["Filière", payload.filiere],
    ["UE", payload.ue],
    ["Année", payload.annee],
    ["Niveau", payload.niveau],
    ...(payload.session ? [["Session", payload.session] as const] : []),
    ...(payload.fileName ? [["Fichier", payload.fileName] as const] : []),
    ...(payload.documentId ? [["ID", payload.documentId] as const] : []),
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:120px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
      <h2 style="color:#0077d2;margin-bottom:8px;">Nouvelle soumission de document</h2>
      <p style="color:#4b5563;margin-top:0;">Un nouveau document vient d'être soumis et attend votre validation.</p>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:20px 0;">
        ${tableRows}
      </table>
      <a href="${adminLink}" style="display:inline-block;background:#0077d2;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold;">
        Ouvrir la file de validation
      </a>
    </div>
  `;
}

export async function sendSubmissionNotificationEmail(
  payload: SubmissionNotificationPayload,
) {
  const config = getBrevoConfig();
  if (!config) {
    return { sent: false as const, skipped: true as const };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: config.senderName,
        email: config.senderEmail,
      },
      to: [{ email: config.adminEmail }],
      subject: `[Banque Epreuve] Nouvelle soumission — ${payload.titre}`,
      htmlContent: buildSubmissionEmailHtml(payload, config),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${details}`);
  }

  return { sent: true as const, skipped: false as const };
}
