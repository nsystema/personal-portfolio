const { createHash } = require('node:crypto');

const RESEND_API_URL = 'https://api.resend.com/emails';
const RESEND_TIMEOUT_MS = 8000;
const RESEND_USER_AGENT = 'TERMINAL_CV/1.0';
const DEFAULT_FROM_EMAIL = 'TERMINAL CV <onboarding@resend.dev>';
const DEFAULT_TO_EMAIL = 'nsystema@mizancalendar.com';

function readBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => resolve(raw));
        req.on('error', reject);
    });
}

function parseBody(rawBody, contentType = '') {
    if (!rawBody) return {};

    if (contentType.includes('application/json')) {
        return JSON.parse(rawBody);
    }

    const params = new URLSearchParams(rawBody);
    const body = {};
    for (const [key, value] of params.entries()) {
        body[key] = value;
    }
    return body;
}

function json(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function buildEmailHtml({ name, email, message, url }) {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const safeUrl = url ? `<p><strong>Page:</strong> ${escapeHtml(url)}</p>` : '';

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
            <h2 style="margin: 0 0 16px;">Website contact request</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeUrl}
            <p><strong>Message:</strong></p>
            <div style="padding: 12px; border-left: 3px solid #444; background: #f6f6f6;">
                ${safeMessage}
            </div>
        </div>
    `.trim();
}

function buildEmailText({ name, email, message, url }) {
    const lines = [
        'Website contact request',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
    ];

    if (url) {
        lines.push(`Page: ${url}`);
    }

    lines.push('', 'Message:', message);

    return lines.join('\n');
}

function buildIdempotencyKey({ name, email, message, url }) {
    return createHash('sha256')
        .update([name, email, message, url].join('\n'))
        .digest('hex');
}

async function postWithTimeout(url, payload, apiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

    try {
        return await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Idempotency-Key': buildIdempotencyKey(payload),
                'User-Agent': RESEND_USER_AGENT,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return json(res, 405, { ok: false, error: 'Method not allowed' });
    }

    try {
        const rawBody = await readBody(req);
        const contentType = String(req.headers['content-type'] || '').toLowerCase();
        const body = parseBody(rawBody, contentType);

        const name = String(body.name || '').trim();
        const email = String(body.email || '').trim();
        const message = String(body.message || '').trim();
        const honeypot = String(body._honey || '').trim();
        const pageUrl = String(body._url || '').trim();

        if (honeypot) {
            return json(res, 200, { ok: true });
        }

        if (!name || !email || !message) {
            return json(res, 400, { ok: false, error: 'Name, email, and message are required.' });
        }

        const apiKey = String(process.env.RESEND_API_KEY || '').trim();
        const fromEmail = String(process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL).trim();
        const toEmail = String(process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL).trim();

        if (!apiKey) {
            return json(res, 500, {
                ok: false,
                error: 'Email service is not configured. Set RESEND_API_KEY in your deployment.',
            });
        }

        const payload = {
            from: fromEmail,
            to: [toEmail],
            subject: `[Website Form] ${email}`,
            reply_to: email,
            html: buildEmailHtml({ name, email, message, url: pageUrl }),
            text: buildEmailText({ name, email, message, url: pageUrl }),
        };

        const upstreamResponse = await postWithTimeout(RESEND_API_URL, payload, apiKey);
        const responseText = await upstreamResponse.text();

        let upstreamData = null;
        try {
            upstreamData = responseText ? JSON.parse(responseText) : null;
        } catch {
            upstreamData = { raw: responseText };
        }

        if (upstreamResponse.ok) {
            return json(res, 200, {
                ok: true,
                provider: 'resend',
                upstream: upstreamData,
            });
        }

        return json(res, 502, {
            ok: false,
            error: 'Email delivery failed through Resend.',
            upstream: upstreamData,
        });
    } catch (error) {
        const timeout = error instanceof Error && error.name === 'AbortError';

        return json(res, 500, {
            ok: false,
            error: timeout
                ? `Resend request timed out after ${RESEND_TIMEOUT_MS}ms.`
                : 'Unexpected contact form failure.',
            detail: error instanceof Error ? error.message : String(error),
        });
    }
};
