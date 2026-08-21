import { getBrevoConfig } from "./sendSubmissionNotification";

export type ContactMessagePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildContactEmailHtml(payload: ContactMessagePayload) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
      <h2 style="color:#0077d2;margin-bottom:8px;">Nouveau message de contact</h2>
      <p style="color:#4b5563;margin-top:0;">Un visiteur vous a écrit depuis Banque Epreuve.</p>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:20px 0;">
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:120px;">Nom</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(payload.name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">Email</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">
            <a href="mailto:${escapeHtml(payload.email)}" style="color:#0077d2;">${escapeHtml(payload.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">Sujet</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(payload.subject)}</td>
        </tr>
      </table>
      <div style="padding:16px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;white-space:pre-wrap;line-height:1.5;">
${escapeHtml(payload.message)}
      </div>
    </div>
  `;
}

export async function sendContactMessageEmail(payload: ContactMessagePayload) {
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
      replyTo: {
        email: payload.email,
        name: payload.name,
      },
      subject: `[Contact] ${payload.subject}`,
      htmlContent: buildContactEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${details}`);
  }

  return { sent: true as const, skipped: false as const };
}
