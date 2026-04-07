const FORM_SUBMIT_ENDPOINTS = [
    'https://formsubmit.co/ajax/nsystema@mizancalendar.com',
    'https://formsubmit.co/nsystema@mizancalendar.com',
];

const UPSTREAM_TIMEOUT_MS = 8000;

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

async function postWithTimeout(endpoint, payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
        return await fetch(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: payload,
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

        if (honeypot) {
            return json(res, 200, { ok: true });
        }

        if (!name || !email || !message) {
            return json(res, 400, { ok: false, error: 'Name, email, and message are required.' });
        }

        const recipientPayload = new URLSearchParams();
        recipientPayload.set('name', name);
        recipientPayload.set('email', email);
        recipientPayload.set('message', message);
        recipientPayload.set('_subject', `[Website Form] ${email}`);
        recipientPayload.set('_replyto', email);
        recipientPayload.set('_captcha', 'false');
        recipientPayload.set('_template', 'table');
        recipientPayload.set('_url', String(body._url || '').trim());

        let lastError = null;

        for (const endpoint of FORM_SUBMIT_ENDPOINTS) {
            try {
                const upstreamResponse = await postWithTimeout(endpoint, recipientPayload.toString());

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
                        upstream: upstreamData,
                    });
                }

                lastError = upstreamData;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    lastError = `Upstream relay timed out after ${UPSTREAM_TIMEOUT_MS}ms`;
                } else {
                    lastError = error instanceof Error ? error.message : String(error);
                }
            }
        }

        return json(res, 502, {
            ok: false,
            error: 'Email relay failed.',
            upstream: lastError,
        });
    } catch (error) {
        return json(res, 500, {
            ok: false,
            error: 'Unexpected contact form failure.',
            detail: error instanceof Error ? error.message : String(error),
        });
    }
};
