import { NextResponse } from "next/server";

type Payload = {
  name?: unknown;
  email?: unknown;
  project?: unknown;
  paymentMethod?: unknown;
  message?: unknown;
  website?: unknown;
};

type FieldName = "name" | "email" | "project" | "paymentMethod" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const maxRequestBytes = 16_384;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recipient = "enisqeta5@gmail.com";
const sender = "Enis Qetaj Website <website@enisqetaj.com>";
const paymentMethods = new Set([
  "Bank transfer (Raiffeisen)",
  "Crypto payment",
  "Discuss payment first",
]);

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validate(payload: Payload) {
  const values = {
    name: stringValue(payload.name),
    email: stringValue(payload.email),
    project: stringValue(payload.project),
    paymentMethod: stringValue(payload.paymentMethod),
    message: stringValue(payload.message),
  };
  const errors: FieldErrors = {};

  if (values.name.length < 2) errors.name = "Enter your name using at least 2 characters.";
  else if (values.name.length > 100) errors.name = "Keep your name under 100 characters.";

  if (!emailPattern.test(values.email)) errors.email = "Enter a valid email address.";
  else if (values.email.length > 200) errors.email = "Keep your email under 200 characters.";

  if (values.project.length < 3) errors.project = "Tell Enis what you are working on.";
  else if (values.project.length > 240) errors.project = "Keep this description under 240 characters.";

  if (!paymentMethods.has(values.paymentMethod)) errors.paymentMethod = "Choose how you would like to pay.";

  if (values.message.length < 20) errors.message = "Add a little more context—at least 20 characters.";
  else if (values.message.length > 4000) errors.message = "Keep your message under 4,000 characters.";

  return { values, errors };
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxRequestBytes) {
    return NextResponse.json(
      { ok: false, message: "The message is too large to send." },
      { status: 413 },
    );
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The message could not be read. Nothing was sent." },
      { status: 400 },
    );
  }

  if (new TextEncoder().encode(raw).byteLength > maxRequestBytes) {
    return NextResponse.json(
      { ok: false, message: "The message is too large to send." },
      { status: 413 },
    );
  }

  let payload: Payload;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid payload");
    payload = parsed as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "The message could not be read. Nothing was sent." },
      { status: 400 },
    );
  }

  if (stringValue(payload.website)) {
    return NextResponse.json({
      ok: true,
      message: "Your message has been sent.",
    });
  }

  const { values, errors } = validate(payload);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      {
        ok: false,
        message: "Check the highlighted fields. Nothing was sent and your message remains in the form.",
        errors,
      },
      { status: 422 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) {
    return NextResponse.json(
      { ok: false, message: "Email delivery is being configured. Please email Enis directly for now." },
      { status: 503 },
    );
  }

  const subject = `[Website] ${values.project} — ${values.name}`;
  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Working on: ${values.project}`,
    `Payment method: ${values.paymentMethod}`,
    "",
    values.message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: values.email,
        subject,
        text,
      }),
    });

    if (!resendResponse.ok) {
      return NextResponse.json(
        { ok: false, message: "The email could not be sent. Please try again or email Enis directly." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "The email could not be sent. Please try again or email Enis directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Message sent. Enis will receive your selected payment method by email.",
  });
}
