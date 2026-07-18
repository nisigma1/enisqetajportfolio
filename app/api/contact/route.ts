import { NextResponse } from "next/server";

type Payload = { name?: unknown; email?: unknown; project?: unknown; message?: unknown; website?: unknown };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Payload;
  try { body = await request.json() as Payload; }
  catch { return NextResponse.json({ ok: false, message: "The note could not be read." }, { status: 400 }); }
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, message: "Thank you." });
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const project = clean(body.project, 240);
  const message = clean(body.message, 4000);
  if (name.length < 2 || !emailPattern.test(email) || project.length < 3 || message.length < 20) {
    return NextResponse.json({ ok: false, message: "Add your name, a valid email, what you are working on and a message of at least 20 characters." }, { status: 422 });
  }
  const subject = encodeURIComponent(`${project} — note from ${name}`);
  const bodyText = encodeURIComponent([`Name: ${name}`, `Email: ${email}`, `Working on: ${project}`, "", message].join("\n"));
  return NextResponse.json({ ok: true, message: "Your note is ready. Continue in email to send it to Enis.", mailto: `mailto:enisqeta5@gmail.com?subject=${subject}&body=${bodyText}` });
}
