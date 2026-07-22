"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactFormSchema } from "@/lib/validators/contact";
import { trackEvent } from "@/components/analytics/AnalyticsBeacon";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const values = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      body: String(formData.get("body") || ""),
    };

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      trackEvent("contact_submit");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't send your message — try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-8">
        <p className="font-display text-2xl text-text-primary">Message sent.</p>
        <p className="mt-2 text-text-muted">
          Thanks for reaching out — I'll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" errors={fieldErrors.name} />
        <Field label="Email" name="email" type="email" errors={fieldErrors.email} />
      </div>
      <Field label="Subject" name="subject" errors={fieldErrors.subject} />
      <Field label="Message" name="body" as="textarea" errors={fieldErrors.body} />

      {errorMessage && <p className="text-sm text-error">{errorMessage}</p>}

      <Button type="submit" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  as = "input",
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  errors?: string[];
}) {
  const baseClasses =
    "w-full rounded-md border border-border bg-card px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors duration-300 ease-premium focus:border-accent";

  return (
    <label className="flex flex-col gap-2 text-sm text-text-secondary">
      {label}
      {as === "textarea" ? (
        <textarea name={name} rows={5} className={baseClasses} />
      ) : (
        <input name={name} type={type} className={baseClasses} />
      )}
      {errors?.map((err) => (
        <span key={err} className="text-xs text-error">
          {err}
        </span>
      ))}
    </label>
  );
}
