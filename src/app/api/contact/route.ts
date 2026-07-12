import { NextResponse } from "next/server";

/**
 * Contact API — receives a submitted enquiry (JSON) and emails it to OFFHAND
 * without the visitor ever leaving the site or opening a mail client.
 *
 * Delivery uses Web3Forms (https://web3forms.com) so no SMTP server or secrets
 * live in the app. Set WEB3FORMS_ACCESS_KEY in your environment (see .env.example)
 * — the key is created for offhand.digital@gmail.com, so every submission lands
 * straight in that inbox.
 */

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email delivery is not configured. Add WEB3FORMS_ACCESS_KEY to your environment.",
      },
      { status: 500 }
    );
  }

  // Normalise the two possible form shapes (LeadGen + Contact page) into one
  // readable email body.
  const name = (data.name as string) || "—";
  const email = (data.email as string) || "";
  const phone = (data.phone as string) || "—";
  const company = (data.company as string) || "—";
  const operation = (data.operation as string) || (data.doing as string) || "—";
  const gmv = (data.gmv as string) || "—";
  const services = Array.isArray(data.services)
    ? (data.services as string[]).join(", ")
    : (data.services as string) || "—";
  const message =
    (data.bottleneck as string) || (data.message as string) || "—";
  const source = (data.source as string) || "Website";

  const lines = [
    `New enquiry from the OFFHAND site (${source})`,
    "",
    `Name:       ${name}`,
    `Email:      ${email || "—"}`,
    `Phone:      ${phone}`,
    `Company:    ${company}`,
    `Website:    ${(data.website as string) || "—"}`,
    `Operation:  ${operation}`,
    `GMV:        ${gmv}`,
    `Services:   ${services}`,
    "",
    "Message / bottleneck:",
    message,
  ];

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Web3Forms 403s server-to-server calls that lack browser-like headers;
        // sending a User-Agent makes the request accepted just like a browser.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New OFFHAND enquiry — ${name}${company !== "—" ? ` (${company})` : ""}`,
        from_name: "OFFHAND Website",
        // NOTE: Web3Forms delivers to the inbox the access key was created for
        // (offhand.digital@gmail.com), so we must NOT override `to` — doing so
        // with an unverified address makes the API reject the submission.
        replyto: email || undefined,
        message: lines.join("\n"),
      }),
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok || result?.success === false) {
      // Surface the real reason (e.g. "Access key is invalid" / not activated).
      console.error("Web3Forms rejected submission:", res.status, result);
      return NextResponse.json(
        { ok: false, error: result?.message || `Delivery failed (${res.status}).` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Web3Forms request threw:", err);
    return NextResponse.json(
      { ok: false, error: "Could not reach the mail service." },
      { status: 502 }
    );
  }
}
