import { getBrevoConfig, type BrevoConfig } from "./sendSubmissionNotification";

export type ContributorNotificationPayload = {
  documentId: string;
  titre: string;
  status: "Validé" | "Rejeté";
  contributorEmail: string;
  contributorName?: string | null;
  type?: string;
  etablissement?: string;
  filiere?: string;
  ue?: string;
  annee?: string;
  niveau?: string;
  reason?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildValidatedEmailHtml(
  payload: ContributorNotificationPayload,
  config: BrevoConfig,
) {
  const catalogLink = `${config.appUrl?.replace(/\/$/, "")}/epreuves`;
  const greeting = payload.contributorName?.trim()
    ? `Bonjour ${escapeHtml(payload.contributorName.trim())},`
    : "Bonjour,";

  const details = [
    ["Titre", payload.titre],
    ...(payload.type ? [["Type", payload.type] as const] : []),
    ...(payload.etablissement ? [["Établissement", payload.etablissement] as const] : []),
    ...(payload.filiere ? [["Filière", payload.filiere] as const] : []),
    ...(payload.ue ? [["UE", payload.ue] as const] : []),
    ...(payload.niveau ? [["Niveau", payload.niveau] as const] : []),
    ...(payload.annee ? [["Année", payload.annee] as const] : []),
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:130px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
      <h2 style="color:#1cb427;margin:0 0 16px;text-align:center;">
        Votre document a été publié !
      </h2>
      <p style="color:#4b5563;margin-top:0;">${greeting}</p>
      <p style="color:#4b5563;">
        Merci pour votre contribution. Votre document est désormais visible dans le catalogue public
        et aidera d'autres étudiants dans leur préparation.
      </p>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:20px 0;">
        ${details}
      </table>
      <div style="text-align:center;margin-top:24px;">
        <a href="${catalogLink}" style="display:inline-block;background:#0077d2;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold;">
          Consulter le catalogue
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin-top:28px;text-align:center;">
        Vous recevez cet email car vous avez choisi d'être notifié lors de la soumission.
        Vous pouvez continuer à contribuer de manière anonyme si vous le souhaitez.
      </p>
    </div>
  `;
}

function buildRejectedEmailHtml(
  payload: ContributorNotificationPayload,
  config: BrevoConfig,
) {
  const submitLink = `${config.appUrl?.replace(/\/$/, "")}/soumettre`;
  const greeting = payload.contributorName?.trim()
    ? `Bonjour ${escapeHtml(payload.contributorName.trim())},`
    : "Bonjour,";

  const reasonBlock = payload.reason?.trim()
    ? `<p style="color:#4b5563;margin:0 0 16px;"><strong>Note du modérateur :</strong> ${escapeHtml(payload.reason.trim())}</p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
      <h2 style="color:#b45309;margin:0 0 16px;text-align:center;">
        Document non publié
      </h2>
      <p style="color:#4b5563;margin-top:0;">${greeting}</p>
      <p style="color:#4b5563;">
        Merci beaucoup pour votre soumission « <strong>${escapeHtml(payload.titre)}</strong> ». Après
        vérification, nous n'avons malheureusement pas pu la publier dans le catalogue.
      </p>

      <p style="color:#4b5563;margin-bottom:8px;">Cela arrive généralement pour l'une de ces raisons :</p>
      <ul style="color:#4b5563;padding-left:20px;margin-top:0;">
        <li style="margin-bottom:6px;">
          <strong>Document illisible</strong> : scan flou, page tronquée, orientation incorrecte
          ou fichier corrompu.
        </li>
        <li style="margin-bottom:6px;">
          <strong>Document déjà présent</strong> : la même épreuve ou ressource existe déjà
          dans le catalogue.
        </li>
      </ul>

      ${reasonBlock}

      <p style="color:#4b5563;">
        <strong>Ne vous découragez pas !</strong> Votre geste de partage compte énormément pour
        la communauté étudiante. Vous pouvez :
      </p>
      <ul style="color:#4b5563;padding-left:20px;">
        <li style="margin-bottom:6px;">re-scanner ou re-photographier le document avec une meilleure qualité,</li>
        <li style="margin-bottom:6px;">proposer une autre épreuve ou ressource qui pourrait manquer,</li>
        <li>partager le lien de la plateforme à vos camarades.</li>
      </ul>

      <div style="text-align:center;margin-top:24px;">
        <a href="${submitLink}" style="display:inline-block;background:#0077d2;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold;">
          Soumettre un nouveau document
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;margin-top:28px;text-align:center;">
        Vous recevez cet email car vous avez choisi d'être notifié lors de la soumission.
        Merci encore pour votre confiance.
      </p>
    </div>
  `;
}

export async function sendContributorNotificationEmail(
  payload: ContributorNotificationPayload,
) {
  const config = getBrevoConfig();
  if (!config) {
    return { sent: false as const, skipped: true as const };
  }

  const isValidated = payload.status === "Validé";
  const subject = isValidated
    ? `Votre document est publié — ${payload.titre}`
    : `Votre document n'a pas été publié — ${payload.titre}`;

  const htmlContent = isValidated
    ? buildValidatedEmailHtml(payload, config)
    : buildRejectedEmailHtml(payload, config);

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
      to: [
        {
          email: payload.contributorEmail,
          ...(payload.contributorName ? { name: payload.contributorName } : {}),
        },
      ],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${details}`);
  }

  return { sent: true as const, skipped: false as const };
}
