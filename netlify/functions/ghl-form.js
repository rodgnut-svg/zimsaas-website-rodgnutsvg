// netlify/functions/ghl-form.js

export async function handler(event) {
    // Only allow POST from your form
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "text/plain" },
        body: "ONLY POST ALLOWED",
      };
    }
  
    // GHL Inbound Webhook URL
    const GHL_WEBHOOK_URL =
      "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/b275d69d-c635-4f3a-b9f5-d738cd5335ef";
  
    // Parse form-urlencoded body from the HTML form
    const params = new URLSearchParams(event.body);
    const data = Object.fromEntries(params.entries());
  
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
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
  
      const text = await res.text();
  
      console.log("Sent to GHL:", payload);
      console.log("GHL status:", res.status);
      console.log("GHL response:", text);
  
      if (res.ok) {
        // Redirect to thank-you page
        return {
          statusCode: 302,
          headers: {
            Location: "/thank-you.html",
          },
        };
      }
  
      // GHL responded but not ok (4xx/5xx)
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/plain" },
        body: `Error sending to GHL: ${text}`,
      };
    } catch (e) {
      console.error("Server error calling GHL:", e);
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/plain" },
        body: "Server error",
      };
    }
  }
  