import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessageEmail } from "@/lib/brevo/sendContactMessage";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(4000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);
    const result = await sendContactMessageEmail(payload);

    if (result.skipped) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Le formulaire de contact n'est pas encore configuré. Réessayez plus tard.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Veuillez vérifier les champs du formulaire." },
        { status: 400 },
      );
    }

    console.error("[contact]", error);
    return NextResponse.json(
      { ok: false, error: "Impossible d'envoyer le message pour le moment." },
      { status: 500 },
    );
  }
}
