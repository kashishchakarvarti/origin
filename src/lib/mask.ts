/** Never expose full PII in the UI — always mask. */

export function maskEmail(email: string | undefined | null): string {
  if (!email?.trim()) return "••••@••••.•••";
  const [local, domain] = email.split("@");
  if (!domain) return "••••@••••.•••";
  const localMasked =
    local.length <= 2 ? `${local[0] ?? "•"}***` : `${local.slice(0, 2)}****`;
  const domainParts = domain.split(".");
  const name = domainParts[0] ?? "•••";
  const tld = domainParts.slice(1).join(".") || "•••";
  const nameMasked = name.length <= 1 ? "****" : `${name[0]}****`;
  return `${localMasked}@${nameMasked}.${tld}`;
}

export function maskPhone(phone: string | undefined | null): string {
  if (!phone?.trim()) return "+** **** ****";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "+** **** ****";
  const last4 = digits.slice(-4);
  const prefix = phone.trim().startsWith("+") ? "+" : "";
  const countryHint = digits.length > 10 ? digits.slice(0, digits.length - 10) : "";
  return `${prefix}${countryHint ? `${countryHint} ` : ""}**** **** ${last4}`;
}

export function maskAddress(address: string | undefined | null): string {
  if (!address?.trim()) return "****, ****, ****";
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return "****, ****, ****";
  if (parts.length === 1) {
    const first = parts[0];
    return `${first.slice(0, Math.min(3, first.length))}****`;
  }
  const city = parts[parts.length - 2] ?? parts[0];
  const region = parts[parts.length - 1];
  const cityMasked =
    city.length <= 2 ? "****" : `${city.slice(0, 2)}****`;
  const regionMasked =
    region.length <= 2 ? "****" : `${region.slice(0, 2)}****`;
  return `****, ${cityMasked}, ${regionMasked}`;
}
