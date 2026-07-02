"use server";

import { submitContact } from "@/lib/api";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate + forward a contact submission via the Nest BFF. */
export async function sendContact(_prev: ContactResult, formData: FormData): Promise<ContactResult> {
  // Honeypot: a filled `company` field means a bot. Silently succeed.
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) return { ok: true };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email." };
  if (message.length < 10) {
    return { ok: false, error: "Message must be at least 10 characters." };
  }

  try {
    const res = await submitContact({
      name,
      email,
      message,
      ...(topic ? { topic } : {}),
    });
    if (!res.ok) return { ok: false, error: "Something went wrong. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again." };
  }
}
