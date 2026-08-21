"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  formInputClass,
  formLabelClass,
  formFieldErrorClass,
} from "@/lib/form-styles";
import { cn } from "@/lib/utils";

type ContactDialogProps = {
  children: ReactNode;
  triggerClassName?: string;
};

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactDialog({
  children,
  triggerClassName,
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Partial<Record<keyof FormState, boolean>> = {};
    if (form.name.trim().length < 2) nextErrors.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = true;
    }
    if (form.subject.trim().length < 3) nextErrors.subject = true;
    if (form.message.trim().length < 10) nextErrors.message = true;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setErrorMessage("Veuillez remplir correctement tous les champs.");
      return;
    }

    setErrors({});
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error || "Impossible d'envoyer le message pour le moment.",
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le message pour le moment.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-pointer bg-transparent p-0 text-left font-inherit",
            triggerClassName,
          )}
        >
          {children}
        </button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-blue-100 p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-gray-100 px-5 py-4 pr-12 text-left">
          <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-[#0f172a]">
            <Mail className="h-5 w-5 text-[#0077d2]" />
            Contacter l&apos;administration
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Posez une question, signalez un problème ou proposez une amélioration.
            Nous vous répondrons par email.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="space-y-4 px-5 py-6">
            <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
              Message envoyé. Merci, l&apos;équipe vous répondra dès que
              possible.
            </p>
            <Button
              type="button"
              className="w-full rounded-xl bg-[#0077d2] text-white hover:bg-[#0062b0]"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
            <div>
              <label htmlFor="contact-name" className={formLabelClass}>
                Nom *
              </label>
              <input
                id="contact-name"
                name="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className={cn(formInputClass, errors.name && formFieldErrorClass)}
                placeholder="Votre nom"
                autoComplete="name"
                disabled={status === "sending"}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className={formLabelClass}>
                Email *
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className={cn(
                  formInputClass,
                  errors.email && formFieldErrorClass,
                )}
                placeholder="prenom.nom@exemple.com"
                autoComplete="email"
                disabled={status === "sending"}
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className={formLabelClass}>
                Sujet *
              </label>
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                className={cn(
                  formInputClass,
                  errors.subject && formFieldErrorClass,
                )}
                placeholder="Ex : Question sur une épreuve"
                disabled={status === "sending"}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className={formLabelClass}>
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                className={cn(
                  formInputClass,
                  "min-h-[120px] resize-y",
                  errors.message && formFieldErrorClass,
                )}
                placeholder="Décrivez votre demande…"
                disabled={status === "sending"}
              />
            </div>

            {status === "error" && errorMessage && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-[#0077d2] text-white hover:bg-[#0062b0]"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le message
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
