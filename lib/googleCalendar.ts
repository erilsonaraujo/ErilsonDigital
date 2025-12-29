import crypto from 'crypto';

interface CalendarEventInput {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  timeZone?: string;
}

const getServiceAccountToken = async () => {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const scope = 'https://www.googleapis.com/auth/calendar';

  if (!clientEmail || !privateKey) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(signingInput), privateKey).toString('base64url');
  const jwt = `${signingInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.access_token as string;
};

export const createCalendarEvent = async (event: CalendarEventInput) => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) return null;

  const token = await getServiceAccountToken();
  if (!token) return null;

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.startIso, timeZone: event.timeZone },
      end: { dateTime: event.endIso, timeZone: event.timeZone },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.id as string;
};
