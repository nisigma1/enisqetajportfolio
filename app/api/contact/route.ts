import { NextResponse } from "next/server";

type Payload = {
  name?: unknown;
  email?: unknown;
  project?: unknown;
  message?: unknown;
  website?: unknown;
};

type FieldName = "name" | "email" | "project" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const maxRequestBytes = 16_384;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const gmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=enisqeta5%40gmail.com";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validate(payload: Payload) {
  const values = {
    name: stringValue(payload.name),
    email: stringValue(payload.email),
    project: stringValue(payload.project),
    message: stringValue(payload.message),
  };
  const errors: FieldErrors = {};

  if (values.name.length < 2) errors.name = "Enter your name using at least 2 characters.";
  else if (values.name.length > 100) errors.name = "Keep your name under 100 characters.";

  if (!emailPattern.test(values.email)) errors.email = "Enter a valid email address.";
  else if (values.email.length > 200) errors.email = "Keep your email under 200 characters.";

  if (values.project.length < 3) errors.project = "Tell Enis what you are working on.";
  else if (values.project.length > 240) errors.project = "Keep this description under 240 characters.";

  if (values.message.length < 20) errors.message = "Add a little more context—at least 20 characters.";
  else if (values.message.length > 4000) errors.message = "Keep your message under 4,000 characters.";

  return { values, errors };
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxRequestBytes) {
    return NextResponse.json(
      { ok: false, message: "The draft is too large to prepare." },
      { status: 413 },
    );
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The draft could not be read. Nothing was sent." },
      { status: 400 },
    );
  }

  if (new TextEncoder().encode(raw).byteLength > maxRequestBytes) {
    return NextResponse.json(
      { ok: false, message: "The draft is too large to prepare." },
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
      { ok: false, message: "The draft could not be read. Nothing was sent." },
      { status: 400 },
    );
  }

  if (stringValue(payload.website)) {
    return NextResponse.json({
      ok: true,
      message: "Your draft is ready. Continue in email to review and send it.",
      mailto: gmailComposeUrl,
    });
  }

  const { values, errors } = validate(payload);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      {
        ok: false,
        message: "Check the highlighted fields. Nothing was sent and your draft remains in the form.",
        errors,
      },
      { status: 422 },
    );
  }

  const subject = encodeURIComponent(`${values.project} — note from ${values.name}`);
  const body = encodeURIComponent([
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Working on: ${values.project}`,
    "",
    values.message,
  ].join("\n"));

  return NextResponse.json({
    ok: true,
    message: "Your draft is ready. Continue in email to review and send it. Nothing has been sent or stored.",
    mailto: `${gmailComposeUrl}&su=${subject}&body=${body}`,
  });
}
