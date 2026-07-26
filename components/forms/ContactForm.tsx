"use client";

import { FocusEvent, FormEvent, useState } from "react";
import { ActionMark } from "@/components/ui/ActionMark";

type FormState = "idle" | "loading" | "ready" | "error";
type FieldName = "name" | "email" | "project" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

type ApiResponse = {
  ok?: boolean;
  message?: string;
  mailto?: string;
  errors?: FieldErrors;
};

const emailAddress = "enisqeta5@gmail.com";
const gmailComposeHref = "https://mail.google.com/mail/?view=cm&fs=1&to=enisqeta5%40gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: FieldName, value: string): string | undefined {
  const clean = value.trim();
  if (name === "name") {
    if (clean.length < 2) return "Enter your name using at least 2 characters.";
    if (clean.length > 100) return "Keep your name under 100 characters.";
  }
  if (name === "email") {
    if (!emailPattern.test(clean)) return "Enter a valid email address.";
    if (clean.length > 200) return "Keep your email under 200 characters.";
  }
  if (name === "project") {
    if (clean.length < 3) return "Tell Enis what you are working on.";
    if (clean.length > 240) return "Keep this description under 240 characters.";
  }
  if (name === "message") {
    if (clean.length < 20) return "Add a little more context—at least 20 characters.";
    if (clean.length > 4000) return "Keep your message under 4,000 characters.";
  }
  return undefined;
}

function readValues(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    project: String(data.get("project") ?? ""),
    message: String(data.get("message") ?? ""),
    website: String(data.get("website") ?? ""),
  };
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [mailto, setMailto] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  function focusFirstError(form: HTMLFormElement, nextErrors: FieldErrors) {
    const firstName = (Object.keys(nextErrors) as FieldName[])[0];
    if (!firstName) return;
    window.requestAnimationFrame(() => {
      const field = form.elements.namedItem(firstName);
      if (field instanceof HTMLElement) field.focus();
    });
  }

  function validateForm(form: HTMLFormElement) {
    const values = readValues(form);
    const nextErrors: FieldErrors = {};
    (Object.keys(values) as Array<keyof typeof values>).forEach((name) => {
      if (name === "website") return;
      const error = validateField(name, values[name]);
      if (error) nextErrors[name] = error;
    });
    return { values, errors: nextErrors };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const clientResult = validateForm(form);

    setMailto(null);
    setStatusMessage("");
    setCopyMessage("");
    setErrors(clientResult.errors);

    if (Object.keys(clientResult.errors).length) {
      setState("error");
      setStatusMessage("Check the highlighted fields. Your draft is still here.");
      focusFirstError(form, clientResult.errors);
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientResult.values),
      });
      const data = await response.json().catch(() => ({})) as ApiResponse;

      if (!response.ok || !data.ok || !data.mailto) {
        const serverErrors = data.errors ?? {};
        setErrors(serverErrors);
        setState("error");
        setStatusMessage(data.message || "The email draft could not be prepared. Your message has not been sent.");
        focusFirstError(form, serverErrors);
        return;
      }

      setMailto(data.mailto);
      setState("ready");
      setStatusMessage(data.message || "Your draft is ready. Continue in email to review and send it.");
    } catch {
      setState("error");
      setStatusMessage("The email draft could not be prepared. Your message has not been sent; you can email Enis directly.");
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = event.currentTarget.name as FieldName;
    if (!(name in { name: true, email: true, project: true, message: true })) return;
    const error = validateField(name, event.currentTarget.value);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  function handleInput(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = event.currentTarget.name as FieldName;
    if (state === "ready") {
      setMailto(null);
      setState("idle");
      setStatusMessage("");
    } else if (state === "error") {
      setState("idle");
      setStatusMessage("");
    }
    if (!errors[name]) return;
    const error = validateField(name, event.currentTarget.value);
    if (!error) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyMessage("Email copied.");
    } catch {
      setCopyMessage("Copy was unavailable. Select the email address instead.");
    }
  }

  function describedBy(name: FieldName) {
    return errors[name] ? `${name}-error` : undefined;
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={state === "loading"}>
      <label>
        <span>Name</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
          onBlur={handleBlur}
          onInput={handleInput}
        />
        {errors.name && <small id="name-error" className="field-error">{errors.name}</small>}
      </label>

      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={200}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          onBlur={handleBlur}
          onInput={handleInput}
        />
        {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
      </label>

      <label className="wide">
        <span>What are you working on?</span>
        <input
          name="project"
          type="text"
          minLength={3}
          maxLength={240}
          required
          aria-invalid={Boolean(errors.project)}
          aria-describedby={describedBy("project")}
          onBlur={handleBlur}
          onInput={handleInput}
        />
        {errors.project && <small id="project-error" className="field-error">{errors.project}</small>}
      </label>

      <label className="wide">
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          minLength={20}
          maxLength={4000}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          onBlur={handleBlur}
          onInput={handleInput}
        />
        {errors.message && <small id="message-error" className="field-error">{errors.message}</small>}
      </label>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-actions wide">
        <button className="form-submit" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Preparing…" : "Prepare email draft"}
          <ActionMark direction="forward" />
        </button>
        <button className="quiet-action" type="button" onClick={copyEmail}>Copy email</button>
      </div>

      {statusMessage && (
        <div
          className={`form-status wide ${state === "error" ? "error" : ""}`}
          role={state === "error" ? "alert" : "status"}
        >
          <span>{statusMessage}</span>
          {state === "ready" && mailto && (
            <a href={mailto} target="_blank" rel="noreferrer">Continue in Gmail <ActionMark direction="external" /></a>
          )}
          {state === "error" && (
            <a href={gmailComposeHref} target="_blank" rel="noreferrer">Email Enis in Gmail</a>
          )}
        </div>
      )}

      {copyMessage && <p className="copy-status wide" role="status">{copyMessage}</p>}
      <p className="form-privacy wide">
        This form only validates your note and prepares an email draft. Nothing is sent or stored here.
      </p>
    </form>
  );
}
