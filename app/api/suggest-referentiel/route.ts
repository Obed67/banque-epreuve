import { NextResponse } from "next/server";
import { z } from "zod";
import { suggestReferentielValues } from "@/lib/suggestReferentiel";

const requestSchema = z.object({
  documentId: z.string().uuid(),
  values: z
    .array(
      z.object({
        field: z.enum(["type", "filiere", "ue", "annee", "niveau", "etablissement"]),
        label: z.string().min(1).max(120),
      }),
    )
    .min(1)
    .max(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = requestSchema.parse(body);
    const result = await suggestReferentielValues(
      payload.values.map((value) => ({
        documentId: payload.documentId,
        field: value.field,
        label: value.label,
      })),
    );

    if (!result.ok) {
      return NextResponse.json(result, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Données invalides." },
        { status: 400 },
      );
    }

    console.error("[suggest-referentiel]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible d'enrichir les référentiels.",
      },
      { status: 500 },
    );
  }
}
