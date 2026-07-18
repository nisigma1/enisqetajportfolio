"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [mailto, setMailto] = useState("mailto:enisqeta5@gmail.com");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as { ok?: boolean; message?: string; mailto?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Please check the highlighted fields and try again.");
      setMailto(data.mailto || mailto);
      setStatus("success");
      setMessage(data.message || "Your message is ready. Continue by email to send it to Enis.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. You can still contact Enis by email.");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("enisqeta5@gmail.com");
      setMessage("Email copied to clipboard.");
      setStatus("success");
    } catch {
      window.location.href = "mailto:enisqeta5@gmail.com";
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={status === "loading"}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" minLength={2} required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required />
      </div>
      <div className="form-field">
        <label htmlFor="company">Company or project</label>
        <input id="company" name="company" type="text" autoComplete="organization" />
      </div>
      <div className="form-field">
        <label htmlFor="service">Service required</label>
        <select id="service" name="service" required defaultValue="">
          <option value="" disabled>Select a service</option>
          <option>Website</option><option>AI application</option><option>Web platform</option><option>Bot or automation</option><option>Research tool</option><option>Digital prototype</option><option>Not sure yet</option>
        </select>
      </div>
      <div className="form-field form-field--wide">
        <label htmlFor="budget">Budget range</label>
        <select id="budget" name="budget" required defaultValue="">
          <option value="" disabled>Select a range</option>
          <option>Under €2,000</option><option>€2,000–€5,000</option><option>€5,000–€10,000</option><option>€10,000+</option><option>Let’s discuss</option>
        </select>
      </div>
      <div className="form-field form-field--wide">
        <label htmlFor="description">Project description</label>
        <textarea id="description" name="description" rows={5} minLength={20} required placeholder="What are you trying to make possible?" />
      </div>
      <div className="form-trap" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-actions form-field--wide">
        <button className="button button--primary" type="submit" disabled={status === "loading"}>{status === "loading" ? "Preparing…" : "Start a conversation"}<span>↗</span></button>
        <button className="button button--secondary" type="button" onClick={copyEmail}>Copy email</button>
      </div>
      {message && <div className={`form-message form-message--${status}`} role={status === "error" ? "alert" : "status"}><p>{message}</p>{status === "success" && <a href={mailto}>Continue in email <span>↗</span></a>}</div>}
      <p className="form-note form-field--wide">No email provider is connected yet. The form validates your message and prepares a private email to Enis; nothing is stored.</p>
    </form>
  );
}

