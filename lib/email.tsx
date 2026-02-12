// Email utility functions for sending notifications

interface EmailConfig {
  to: string
  subject: string
  html: string
  text?: string
}

// Simple email sending function (can be upgraded to Resend/SendGrid)
export async function sendEmail({ to, subject, html, text }: EmailConfig) {
  // For now, we'll log emails. In production, integrate with Resend or SendGrid
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Email would be sent:", { to, subject })
    return { success: true }
  }

  // TODO: Integrate with email service provider
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // return await resend.emails.send({ from: 'noreply@dwellot.com', to, subject, html, text })

  return { success: true }
}

// Email template wrapper
function emailTemplate(content: string, title: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; }
    .button { display: inline-block; background: #0ea5e9; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #0284c7; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; }
    .property-card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: 600; color: #666; }
    .value { color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dwellot</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 Dwellot. Ghana's Premier Property Marketplace.</p>
      <p><a href="https://dwellot.com" style="color: #0ea5e9; text-decoration: none;">Visit Website</a> | <a href="mailto:support@dwellot.com" style="color: #0ea5e9; text-decoration: none;">Contact Support</a></p>
    </div>
  </div>
</body>
</html>
  `
}

// New inquiry notification to agent
export async function sendInquiryNotification({
  agentEmail,
  agentName,
  propertyTitle,
  propertyId,
  inquirerName,
  inquirerEmail,
  inquirerPhone,
  message,
}: {
  agentEmail: string
  agentName: string
  propertyTitle: string
  propertyId: string
  inquirerName: string
  inquirerEmail: string
  inquirerPhone?: string
  message: string
}) {
  const content = `
    <h2>New Property Inquiry</h2>
    <p>Hi ${agentName},</p>
    <p>You have received a new inquiry for your property:</p>
    
    <div class="property-card">
      <h3 style="margin-top: 0; color: #0ea5e9;">${propertyTitle}</h3>
      <div class="info-row">
        <span class="label">From:</span>
        <span class="value">${inquirerName}</span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value"><a href="mailto:${inquirerEmail}" style="color: #0ea5e9;">${inquirerEmail}</a></span>
      </div>
      ${inquirerPhone ? `<div class="info-row"><span class="label">Phone:</span><span class="value">${inquirerPhone}</span></div>` : ""}
      <div class="info-row">
        <span class="label">Message:</span>
      </div>
      <p style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0;">${message}</p>
    </div>

    <p style="text-align: center;">
      <a href="https://dwellot.com/properties/${propertyId}" class="button">View Property</a>
      <a href="https://dwellot.com/dashboard/inquiries" class="button" style="background: #10b981;">Manage Inquiries</a>
    </p>

    <p style="color: #666; font-size: 14px;">Respond quickly to increase your chances of closing the deal!</p>
  `

  return sendEmail({
    to: agentEmail,
    subject: `New Inquiry: ${propertyTitle}`,
    html: emailTemplate(content, "New Property Inquiry"),
  })
}

// Welcome email for new users
export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  const content = `
    <h2>Welcome to Dwellot! 🏡</h2>
    <p>Hi ${name},</p>
    <p>Thank you for joining Ghana's premier property marketplace. We're excited to help you find your perfect home!</p>
    
    <div class="property-card">
      <h3 style="margin-top: 0;">Get Started:</h3>
      <ul style="line-height: 2;">
        <li>Browse thousands of verified properties</li>
        <li>Save your favorite listings</li>
        <li>Contact agents directly</li>
        <li>Set up property alerts</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <a href="https://dwellot.com/properties" class="button">Browse Properties</a>
    </p>

    <p>Need help? Our support team is always here to assist you at <a href="mailto:support@dwellot.com" style="color: #0ea5e9;">support@dwellot.com</a></p>
  `

  return sendEmail({
    to: email,
    subject: "Welcome to Dwellot - Find Your Perfect Home",
    html: emailTemplate(content, "Welcome to Dwellot"),
  })
}

// Inquiry confirmation to user
export async function sendInquiryConfirmation({
  userEmail,
  userName,
  propertyTitle,
  propertyId,
  agentName,
}: {
  userEmail: string
  userName: string
  propertyTitle: string
  propertyId: string
  agentName: string
}) {
  const content = `
    <h2>Inquiry Sent Successfully ✓</h2>
    <p>Hi ${userName},</p>
    <p>Your inquiry has been sent successfully. The property agent will contact you shortly.</p>
    
    <div class="property-card">
      <h3 style="margin-top: 0; color: #0ea5e9;">${propertyTitle}</h3>
      <div class="info-row">
        <span class="label">Agent:</span>
        <span class="value">${agentName}</span>
      </div>
      <div class="info-row">
        <span class="label">Status:</span>
        <span class="value" style="color: #10b981;">Pending Response</span>
      </div>
    </div>

    <p style="text-align: center;">
      <a href="https://dwellot.com/properties/${propertyId}" class="button">View Property</a>
    </p>

    <p style="color: #666; font-size: 14px;">The agent typically responds within 24 hours. If you have urgent questions, you can contact them directly through the property listing.</p>
  `

  return sendEmail({
    to: userEmail,
    subject: `Inquiry Confirmation: ${propertyTitle}`,
    html: emailTemplate(content, "Inquiry Confirmation"),
  })
}

// Property alert email
export async function sendPropertyAlert({
  userEmail,
  userName,
  properties,
}: {
  userEmail: string
  userName: string
  properties: Array<{ id: string; title: string; location: string; price: number; image: string }>
}) {
  const propertiesHtml = properties
    .map(
      (property) => `
    <div class="property-card" style="display: flex; gap: 15px; align-items: center;">
      <img src="${property.image}" alt="${property.title}" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;" />
      <div style="flex: 1;">
        <h4 style="margin: 0 0 5px 0; color: #0ea5e9;">${property.title}</h4>
        <p style="margin: 5px 0; color: #666;">${property.location}</p>
        <p style="margin: 5px 0; font-weight: 600; color: #333;">$${property.price.toLocaleString()}</p>
        <a href="https://dwellot.com/properties/${property.id}" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">View Details →</a>
      </div>
    </div>
  `,
    )
    .join("")

  const content = `
    <h2>New Properties Match Your Criteria 🎯</h2>
    <p>Hi ${userName},</p>
    <p>We found ${properties.length} new ${properties.length === 1 ? "property" : "properties"} that match your search preferences:</p>
    
    ${propertiesHtml}

    <p style="text-align: center; margin-top: 30px;">
      <a href="https://dwellot.com/properties" class="button">View All Properties</a>
    </p>

    <p style="color: #666; font-size: 14px;">Want to adjust your alerts? <a href="https://dwellot.com/profile" style="color: #0ea5e9;">Update your preferences</a></p>
  `

  return sendEmail({
    to: userEmail,
    subject: `${properties.length} New ${properties.length === 1 ? "Property" : "Properties"} Match Your Search`,
    html: emailTemplate(content, "Property Alert"),
  })
}

// Newsletter email
export async function sendNewsletterEmail({
  email,
  name,
  subject,
  content,
}: {
  email: string
  name: string
  subject: string
  content: string
}) {
  const emailContent = `
    <p>Hi ${name},</p>
    ${content}
    <p>Best regards,<br>The Dwellot Team</p>
  `

  return sendEmail({
    to: email,
    subject: subject,
    html: emailTemplate(emailContent, subject),
  })
}
