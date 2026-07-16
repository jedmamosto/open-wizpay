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

        const [tField, v1Field] = signatureHeader.split(',');
        if (!tField || !v1Field) {
            return false;
        }

        const timestamp = tField.split('=')[1];
        const signature = v1Field.split('=')[1];

        if (!timestamp || !signature) {
            return false;
        }

        const payload = `${timestamp}.${rawBody}`;
        const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        return computedSignature === signature;
    } catch (error) {
        console.error('Error verifying PayMongo signature:', error);
        return false;
    }
}
