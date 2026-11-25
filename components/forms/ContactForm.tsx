"use client";

import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { identity } from "@/data/site";
import { contactEmailDraft } from "@/lib/contact-email";
import { contactPaymentMethods, cryptoInquiry, cryptoPlanInquiries, digitalInquiry, getInquiryFromQuery, isContactPaymentMethod, isCryptoInquiry } from "@/lib/contact-inquiries";

type FormState = "idle" | "loading" | "ready" | "error";
type FieldName = "name" | "email" | "project" | "paymentMethod" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

type ApiResponse = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
};

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
    if (clean.length < 3) return "Select an inquiry type.";
    if (clean.length > 240) return "Keep this description under 240 characters.";
  }
  if (name === "paymentMethod") {
    if (!isContactPaymentMethod(clean)) return "Choose a payment preference or select ‘Discuss payment first’.";
  }
  if (name === "message") {
    if (clean.length < 20) return "Write at least 20 characters.";
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
    paymentMethod: String(data.get("paymentMethod") ?? ""),
    message: String(data.get("message") ?? ""),
    website: String(data.get("website") ?? ""),
  };
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [inquiry, setInquiry] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof contactEmailDraft> | null>(null);
  const query = useSearchParams().toString();
  const needsPayment = isCryptoInquiry(inquiry);

  useEffect(() => {
    setInquiry(getInquiryFromQuery(query));
    setErrors(current => ({ ...current, project: undefined, paymentMethod: undefined }));
  }, [query]);

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
    const requiresPayment = isCryptoInquiry(values.project);
    if (!requiresPayment) values.paymentMethod = "";
    (Object.keys(values) as Array<keyof typeof values>).forEach((name) => {
      if (name === "website" || (name === "paymentMethod" && !requiresPayment)) return;
      const error = validateField(name, values[name]);
      if (error) nextErrors[name] = error;
    });
    return { values, errors: nextErrors };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading" || state === "ready") return;
    const form = event.currentTarget;
    const clientResult = validateForm(form);

    setStatusMessage("");
    setDraft(null);
    setErrors(clientResult.errors);

    if (Object.keys(clientResult.errors).length) {
      setState("error");
      setStatusMessage("Check the highlighted fields. Your message is still here.");
      focusFirstError(form, clientResult.errors);
      return;
    }

    setState("loading");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    function offerEmailDraft() {
      setDraft(contactEmailDraft(identity.email, clientResult.values));
      setState("error");
      setStatusMessage("Online delivery is temporarily unavailable. Open the prepared email draft and send it from your email app. Nothing has been sent yet; your message is still here.");
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientResult.values),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({})) as ApiResponse;

      if (!response.ok || !data.ok) {
        const serverErrors = data.errors ?? {};
        if (!Object.keys(serverErrors).length) {
          offerEmailDraft();
          return;
        }
        setErrors(serverErrors);
        setState("error");
        setStatusMessage(data.message || "The email could not be sent. Your message has not been sent.");
        focusFirstError(form, serverErrors);
        return;
      }

      form.reset();
      setState("ready");
      setStatusMessage(data.message || "Message sent to Enis.");
    } catch {
      offerEmailDraft();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = event.currentTarget.name as FieldName;
    if (!(name in { name: true, email: true, project: true, paymentMethod: true, message: true })) return;
    const error = validateField(name, event.currentTarget.value);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  function handleInput(event: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setDraft(null);
    const name = event.currentTarget.name as FieldName;
    if (state === "ready") {
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

  function changeInquiry(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    setInquiry(value);
    handleInput(event);
    if (!isCryptoInquiry(value)) setErrors(current => ({ ...current, paymentMethod: undefined }));
  }

  function describedBy(name: FieldName) {
    return errors[name] ? `${name}-error` : undefined;
  }

  return (
    <form id="contact-form" className="contact-form" action="/api/contact" method="post" onSubmit={submit} noValidate aria-labelledby="contact-form-title" aria-busy={state === "loading"}>
      <h2 id="contact-form-title" className="wide">Send a message</h2>
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

      <label className={needsPayment ? undefined : "wide"}>
        <span>Inquiry type</span>
        <span className="select-control">
          <select
            name="project"
            required
            aria-invalid={Boolean(errors.project)}
            aria-describedby={describedBy("project")}
            onBlur={handleBlur}
            onChange={changeInquiry}
            value={inquiry}
          >
            <option value="" disabled>Select an inquiry type</option>
            <option value={digitalInquiry}>Digital project</option>
            <option value={cryptoInquiry}>Crypto analysis</option>
            <optgroup label="Crypto analysis plans">
              {cryptoPlanInquiries.map(({ id, value, label }) => <option key={id} value={value}>{label}</option>)}
            </optgroup>
            <option value="Other Inquiry">Other inquiry</option>
          </select>
        </span>
        {errors.project && <small id="project-error" className="field-error">{errors.project}</small>}
      </label>

      {needsPayment && <label>
        <span id="payment-method-label">Payment preference</span>
        <span className="select-control">
          <select
            name="paymentMethod"
            required
            aria-labelledby="payment-method-label"
            aria-invalid={Boolean(errors.paymentMethod)}
            aria-describedby={errors.paymentMethod ? "paymentMethod-error payment-note" : "payment-note"}
            onBlur={handleBlur}
            onChange={handleInput}
            defaultValue=""
          >
            <option value="" disabled>Choose a payment preference</option>
            {contactPaymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </span>
        {errors.paymentMethod && <small id="paymentMethod-error" className="field-error">{errors.paymentMethod}</small>}
      </label>}
      {needsPayment && <p id="payment-note" className="form-privacy wide">No payment is taken here. Enis emails the payment details and sends the Discord invite once payment is confirmed.</p>}

      <label className="wide">
        <span>Message</span>
        <textarea
          name="message"
          rows={4}
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
        <button className="button button--primary" type="submit" disabled={state === "loading" || state === "ready"}>
          {state === "loading" ? "Sending…" : needsPayment ? "Send request" : "Send email"}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`form-status wide ${state === "error" ? "error" : ""}`}
          role={state === "error" ? "alert" : "status"}
        >
          <span>{statusMessage}</span>
          {state === "error" && (
            <a href={draft?.href ?? `mailto:${identity.email}`}>{draft ? "Open prepared email draft" : "Email Enis directly"}</a>
          )}
          {draft && (
            <button className="button button--secondary" type="button" onClick={async () => {
              try {
                await navigator.clipboard.writeText(draft.text);
                setStatusMessage("Email text copied. Paste it into your email app and send it to Enis. Nothing has been sent automatically.");
              } catch {
                setStatusMessage("Copy is unavailable in this browser. Your message is still in the form; open the prepared draft or copy the fields manually.");
              }
            }}>Copy email text</button>
          )}
        </div>
      )}

      <p className="form-privacy wide">
        Your message goes to Enis by email and isn’t stored on this site.
      </p>
    </form>
  );
}
