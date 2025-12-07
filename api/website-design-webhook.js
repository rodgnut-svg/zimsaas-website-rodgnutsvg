// api/website-design-webhook.js

import { Readable } from 'stream';
import busboy from 'busboy';

// Disable default body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Parse multipart/form-data using busboy
const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};
    
    const busboyInstance = busboy({ headers: req.headers });
    
    busboyInstance.on('field', (name, value) => {
      if (!fields[name]) {
        fields[name] = [];
      }
      fields[name].push(value);
    });
    
    busboyInstance.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];
      
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      file.on('end', () => {
        if (!files[name]) {
          files[name] = [];
        }
        files[name].push({
          filename,
          data: Buffer.concat(chunks),
          contentType: mimeType,
        });
      });
    });
    
    busboyInstance.on('finish', () => {
      resolve({ fields, files });
    });
    
    busboyInstance.on('error', (error) => {
      reject(error);
    });
    
    // Pipe the request to busboy
    // For Vercel, req should be a stream when bodyParser is disabled
    if (req.readable) {
      req.pipe(busboyInstance);
    } else if (req.body) {
      // Fallback: if body is already available as buffer
      if (Buffer.isBuffer(req.body)) {
        Readable.from(req.body).pipe(busboyInstance);
      } else if (typeof req.body === 'string') {
        Readable.from(Buffer.from(req.body)).pipe(busboyInstance);
      } else {
        // Try to pipe anyway
        if (typeof req.pipe === 'function') {
          req.pipe(busboyInstance);
        } else {
          reject(new Error('Cannot parse request body'));
        }
      }
    } else {
      // Try to pipe the request directly
      if (typeof req.pipe === 'function') {
        req.pipe(busboyInstance);
      } else {
        reject(new Error('Request body not available'));
      }
    }
  });
};

export default async function handler(req, res) {
  // Only allow POST from your form
  if (req.method !== "POST") {
    return res.status(405).send("ONLY POST ALLOWED");
  }

  // GHL Inbound Webhook URL
  const GHL_WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/4d6279d4-ee92-42b2-a838-6f5a7a62b823";

  try {
    // Parse multipart/form-data
    const { fields, files } = await parseMultipart(req);

    // Extract text fields
    const name = fields.name && fields.name[0] ? fields.name[0] : "";
    const email = fields.email && fields.email[0] ? fields.email[0] : "";
    const companyName = fields.companyName && fields.companyName[0] ? fields.companyName[0] : "";
    const automationFeaturesJson = fields.automation_features && fields.automation_features[0] ? fields.automation_features[0] : "[]";
    
    // Parse automation features
    let automationFeatures = [];
    try {
      automationFeatures = JSON.parse(automationFeaturesJson);
    } catch (e) {
      automationFeatures = [];
    }

    // Convert files to base64
    const convertFileToBase64 = (fileArray) => {
      if (!fileArray || fileArray.length === 0) return null;
      return fileArray[0].data.toString('base64');
    };

    // Handle logo
    const logoBase64 = files.logo ? convertFileToBase64(files.logo) : null;

    // Handle inspiration images (up to 3)
    const inspirationImages = [];
    for (let i = 0; i < 3; i++) {
      const imageKey = `inspirationImage_${i}`;
      if (files[imageKey]) {
        const base64 = convertFileToBase64(files[imageKey]);
        if (base64) {
          inspirationImages.push(base64);
        }
      }
    }

    // Handle PDF
    const pdfBase64 = files.businessInfoPdf ? convertFileToBase64(files.businessInfoPdf) : null;

    // Map to GHL webhook format
    const payload = {
      "Name": name,
      "Email": email,
      "Company Name": companyName,
      "Automation Features": Array.isArray(automationFeatures) ? automationFeatures.join(", ") : automationFeatures,
      "Logo": logoBase64 || "",
      "Inspiration Images": inspirationImages.join("|||"), // Use ||| as separator for multiple images
      "Business Info PDF": pdfBase64 || "",
    };

    // Send as x-www-form-urlencoded to GHL
    const bodyParams = new URLSearchParams();
    Object.keys(payload).forEach(key => {
      bodyParams.append(key, payload[key]);
    });

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    const text = await response.text();

    console.log("Sent to GHL:", {
      Name: payload.Name,
      Email: payload.Email,
      "Company Name": payload["Company Name"],
      "Automation Features": payload["Automation Features"],
      "Has Logo": !!logoBase64,
      "Inspiration Images Count": inspirationImages.length,
      "Has PDF": !!pdfBase64,
    });
    console.log("GHL status:", response.status);
    console.log("GHL response:", text);

    if (response.ok) {
      // Return success - frontend will handle redirect
      return res.status(200).json({ success: true, message: "Form submitted successfully" });
    }

    // GHL responded but not ok (4xx/5xx)
    return res.status(500).json({ success: false, error: `Error sending to GHL: ${text}` });
  } catch (e) {
    console.error("Server error processing form:", e);
    return res.status(500).send(`Server error: ${e.message}`);
  }
}

