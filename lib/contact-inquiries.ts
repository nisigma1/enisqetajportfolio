import { pricingPlans } from "@/data/site";

export const digitalInquiry = "Digital Project";
export const cryptoInquiry = "Crypto Analysis";

export const cryptoPlanInquiries = pricingPlans.map(({ id, name, price }) => ({
  id,
  value: `Crypto market analysis — ${name} plan (€${price} / month)`,
  label: `${name} (€${price}/month)`,
}));

export const contactPaymentMethods = [
  "Bank transfer (Raiffeisen)",
  "Crypto payment",
  "Discuss payment first",
] as const;

export function isCryptoInquiry(project: string) {
  return project === cryptoInquiry || cryptoPlanInquiries.some(({ value }) => value === project);
}

export function isContactPaymentMethod(value: string) {
  return contactPaymentMethods.some(method => method === value);
}

export function getInquiryFromQuery(query: string) {
  const params = new URLSearchParams(query);
  const service = params.get("service");
  if (service === "digital-project") return digitalInquiry;
  const plan = cryptoPlanInquiries.find(({ id }) => id === params.get("plan"));
  return plan?.value ?? (service === "crypto-analysis" ? cryptoInquiry : "");
}
