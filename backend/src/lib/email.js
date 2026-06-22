export async function sendBrevo({ to, toName, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL is not set');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'SLS Consultants', email: senderEmail },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo error: ${err}`);
  }
}
