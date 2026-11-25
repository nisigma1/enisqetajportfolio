type ContactEmailValues = {
  name: string;
  email: string;
  project: string;
  paymentMethod: string;
  message: string;
};

export function contactEmailDraft(recipient: string, values: ContactEmailValues) {
  const subject = `[Website] ${values.project} — ${values.name}`.replace(/[\r\n]+/g, " ");
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Working on: ${values.project}`,
    ...(values.paymentMethod ? [`Payment method: ${values.paymentMethod}`] : []),
    "", values.message,
  ].join("\n");
  return {
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `To: ${recipient}\nSubject: ${subject}\n\n${body}`,
  };
}
