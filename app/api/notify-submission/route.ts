import { NextResponse } from "next/server";
import { z } from "zod";
import { sendSubmissionNotificationEmail } from "@/lib/brevo/sendSubmissionNotification";

const submissionNotificationSchema = z.object({
  documentId: z.string().uuid().optional(),
  titre: z.string().min(1).max(500),
  type: z.string().min(1).max(120),
  filiere: z.string().min(1).max(120),
  ue: z.string().min(1).max(200),
  annee: z.string().min(1).max(20),
  session: z.string().max(120).nullable().optional(),
  fileName: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = submissionNotificationSchema.parse(body);
    const result = await sendSubmissionNotificationEmail(payload);

    if (result.skipped) {
      return NextResponse.json({
        ok: true,
        sent: false,
        message: "Notification email non configurée.",
      });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Données de notification invalides." },
        { status: 400 },
      );
    }

    console.error("[notify-submission]", error);
    return NextResponse.json(
      { ok: false, error: "Impossible d'envoyer la notification." },
      { status: 500 },
    );
  }
}
