import fetch from 'node-fetch';

const baseUrl = process.env.SITE_URL || 'https://erilsondigital.com';
const sessionToken = process.env.ADMIN_SESSION;
const paymentId = process.env.PAYMENT_ID;

if (!sessionToken || !paymentId) {
  console.error('ADMIN_SESSION and PAYMENT_ID are required');
  process.exit(1);
}

(async () => {
  const res = await fetch(`${baseUrl}/api/admin/ecommerce/payments/${paymentId}/mark-paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: `admin_session=${sessionToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  console.log('Status:', res.status, data);
  if (!res.ok) {
    process.exit(1);
  }
})();
