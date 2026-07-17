import crypto from 'crypto';

/**
 * Verifies the signature of an incoming PayMongo webhook request to prevent spoofing.
 *
 * @param signatureHeader The value of the X-Paymongo-Signature header
 * @param rawBody The raw body of the request as a string
 * @param webhookSecret The webhook secret key (e.g. from env)
 * @returns boolean true if signature is valid, false otherwise
 */
export function verifyPaymongoSignature(
    signatureHeader: string,
    rawBody: string,
    webhookSecret: string
): boolean {
    try {
        if (!signatureHeader || !rawBody || !webhookSecret) {
            return false;
        }

        // Parse signature header into key-value pairs (supports t, te, li, v1)
        const parts = signatureHeader.split(',').reduce((acc, part) => {
            const [key, val] = part.trim().split('=');
            if (key && val) {
                acc[key] = val;
            }
            return acc;
        }, {} as Record<string, string>);

        const timestamp = parts['t'];
        if (!timestamp) {
            return false;
        }

        // PayMongo sends 'li' (live) or 'te' (test). Stripe/legacy uses 'v1'.
        const signature = parts['li'] || parts['te'] || parts['v1'];
        if (!signature) {
            return false;
        }

        const payload = `${timestamp}.${rawBody}`;
        const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        // Timing-safe comparison to prevent timing attacks
        const sigBuffer = Buffer.from(signature, 'hex');
        const computedBuffer = Buffer.from(computedSignature, 'hex');

        if (sigBuffer.length !== computedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(sigBuffer, computedBuffer);
    } catch (error) {
        console.error('Error verifying PayMongo signature:', error);
        return false;
    }
}
