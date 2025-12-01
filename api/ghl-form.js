// api/ghl-form.js

export default async function handler(req, res) {
  // Only allow POST from your form
  if (req.method !== "POST") {
    return res.status(405).send("ONLY POST ALLOWED");
  }

  // GHL Inbound Webhook URL
  const GHL_WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/b275d69d-c635-4f3a-b9f5-d738cd5335ef";

  // Parse form-urlencoded body from the HTML form
  // Vercel automatically parses the body, but for form-urlencoded we need to handle it
  let data = {};
  
  if (typeof req.body === 'string') {
    // If body is a string, parse it
    const params = new URLSearchParams(req.body);
    data = Object.fromEntries(params.entries());
  } else if (req.body) {
    // If already parsed (shouldn't happen with form-urlencoded, but just in case)
    data = req.body;
  }

  // Map to the *exact* keys you used in Postman / GHL mapping
  const payload = {
    "Full Name": data.fullName || "",
    "Business Name": data.businessName || "",
    "Whatsapp Number": data.whatsapp || "",
    "Email": data.email || "",
    "What do you want to automate?": data.automationGoals || "",
  };

  // Send as x-www-form-urlencoded (like a normal HTML form / Postman form)
  const body = new URLSearchParams(payload).toString();

  try {
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const text = await response.text();

    console.log("Sent to GHL:", payload);
    console.log("GHL status:", response.status);
    console.log("GHL response:", text);

    if (response.ok) {
      // Redirect to thank-you page
      return res.redirect(302, "/thank-you.html");
    }

    // GHL responded but not ok (4xx/5xx)
    return res.status(500).send(`Error sending to GHL: ${text}`);
  } catch (e) {
    console.error("Server error calling GHL:", e);
    return res.status(500).send("Server error");
  }
}

