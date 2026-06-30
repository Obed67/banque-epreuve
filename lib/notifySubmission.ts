import type { SubmissionNotificationPayload } from "@/lib/brevo/sendSubmissionNotification";

export async function notifyAdminOfSubmission(
  payload: SubmissionNotificationPayload,
) {
  try {
    const response = await fetch("/api/notify-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("[notify-submission] API error", await response.text());
    }
  } catch (error) {
    console.warn("[notify-submission] request failed", error);
  }
}
