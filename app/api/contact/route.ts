import { NextResponse } from "next/server";

type ContactPayload = { name?: unknown; email?: unknown; company?: unknown; service?: unknown; budget?: unknown; description?: unknown; website?: unknown };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: ContactPayload;
  try { body = await request.json() as ContactPayload; }
  catch { return NextResponse.json({ ok: false, message: "The message could not be read." }, { status: 400 }); }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true, message: "Thank you." });
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const service = clean(body.service, 100);
  const budget = clean(body.budget, 100);
  const description = clean(body.description, 4000);
  if (name.length < 2 || !emailPattern.test(email) || !service || !budget || description.length < 20) {
    return NextResponse.json({ ok: false, message: "Please add a valid name, email, service, budget and a project description of at least 20 characters." }, { status: 422 });
  }
  const subject = encodeURIComponent(`Project inquiry from ${name}`);
  const message = encodeURIComponent([`Name: ${name}`, `Email: ${email}`, `Company / project: ${company || "Not provided"}`, `Service: ${service}`, `Budget: ${budget}`, "", description].join("\n"));
  // Integration point: replace this mailto response with a transactional email
  // provider call when server-side credentials are configured in Sites.
  return NextResponse.json({ ok: true, message: "Your message is ready. Continue by email to send it to Enis.", mailto: `mailto:enisqeta5@gmail.com?subject=${subject}&body=${message}` });
}

