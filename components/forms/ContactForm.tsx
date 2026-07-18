"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [mailto, setMailto] = useState("mailto:enisqeta5@gmail.com");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const data = await response.json() as { ok?: boolean; message?: string; mailto?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Please check the form and try again.");
      setMailto(data.mailto || mailto);
      setMessage(data.message || "Your note is ready to send.");
      setState("success");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Email Enis directly instead.");
      setState("error");
    }
  }

  async function copyEmail() {
    try { await navigator.clipboard.writeText("enisqeta5@gmail.com"); setMessage("Email copied."); setState("success"); }
    catch { window.location.href = "mailto:enisqeta5@gmail.com"; }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={state === "loading"}>
      <label><span>Name</span><input name="name" type="text" autoComplete="name" minLength={2} required /></label>
      <label><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required /></label>
      <label className="wide"><span>What are you working on?</span><input name="project" type="text" minLength={3} required /></label>
      <label className="wide"><span>Message</span><textarea name="message" rows={5} minLength={20} required /></label>
      <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-actions wide"><button className="form-submit" type="submit" disabled={state === "loading"}>{state === "loading" ? "Preparing…" : "Start a conversation"}<span>↗</span></button><button className="quiet-action" type="button" onClick={copyEmail}>Copy email</button></div>
      {message && <div className={`form-status wide ${state === "error" ? "error" : ""}`} role={state === "error" ? "alert" : "status"}>{message}{state === "success" && <a href={mailto}>Continue in email ↗</a>}</div>}
      <p className="form-privacy wide">The form validates your note and prepares a private email. Nothing is stored.</p>
    </form>
  );
}
