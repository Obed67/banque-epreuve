export async function notifyContributor(payload: {
  documentId: string;
  status: "Validé" | "Rejeté";
  reason?: string | null;
}) {
  try {
    const response = await fetch("/api/notify-contributor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(
        "[notify-contributor] API error",
        await response.text(),
      );
    }
  } catch (error) {
    console.warn("[notify-contributor] request failed", error);
  }
}
