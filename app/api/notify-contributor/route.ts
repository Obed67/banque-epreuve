import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendContributorNotificationEmail } from "@/lib/brevo/sendContributorNotification";

const notifyContributorSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(["Validé", "Rejeté"]),
  reason: z.string().max(500).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = notifyContributorSchema.parse(body);

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        {
          ok: true,
          sent: false,
          message:
            "Notification contributeur non configurée (SUPABASE_SERVICE_ROLE_KEY manquant).",
        },
        { status: 200 },
      );
    }

    const { data: contact, error: contactError } = await admin
      .from("submission_contacts")
      .select(
        "id, contributor_email, contributor_name, notify_contributor, notified_status",
      )
      .eq("document_id", payload.documentId)
      .maybeSingle();

    if (contactError) {
      console.error("[notify-contributor] fetch contact", contactError);
      return NextResponse.json(
        { ok: false, error: "Impossible de récupérer le contact." },
        { status: 500 },
      );
    }

    if (!contact || !contact.notify_contributor || !contact.contributor_email) {
      return NextResponse.json({
        ok: true,
        sent: false,
        reason: "no-contact",
      });
    }

    if (contact.notified_status === payload.status) {
      return NextResponse.json({
        ok: true,
        sent: false,
        reason: "already-notified",
      });
    }

    const { data: document, error: docError } = await admin
      .from("epreuves")
      .select(
        "id, titre, type, etablissement, filiere, ue, annee, niveau",
      )
      .eq("id", payload.documentId)
      .maybeSingle();

    if (docError || !document) {
      console.error("[notify-contributor] fetch document", docError);
      return NextResponse.json(
        { ok: false, error: "Document introuvable." },
        { status: 404 },
      );
    }

    const result = await sendContributorNotificationEmail({
      documentId: document.id,
      titre: document.titre,
      status: payload.status,
      contributorEmail: contact.contributor_email,
      contributorName: contact.contributor_name,
      type: document.type ?? undefined,
      etablissement: document.etablissement ?? undefined,
      filiere: document.filiere ?? undefined,
      ue: document.ue ?? undefined,
      niveau: document.niveau ?? undefined,
      annee: document.annee ?? undefined,
      reason: payload.reason ?? null,
    });

    if (result.sent) {
      await admin
        .from("submission_contacts")
        .update({
          notified_at: new Date().toISOString(),
          notified_status: payload.status,
        })
        .eq("id", contact.id);
    }

    return NextResponse.json({ ok: true, sent: result.sent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Payload invalide." },
        { status: 400 },
      );
    }
    console.error("[notify-contributor]", error);
    return NextResponse.json(
      { ok: false, error: "Impossible d'envoyer la notification contributeur." },
      { status: 500 },
    );
  }
}
