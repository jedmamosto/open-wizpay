const SECRET = process.env.SESSION_SECRET || 'default-fallback-dev-secret-key-at-least-32-chars';

async function getCryptoKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    // Derive a 256-bit key from the SESSION_SECRET using SHA-256
    const keyData = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(SECRET));
    
    return await globalThis.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts a session payload into a secure token string.
 */
export async function encryptSession(data: any): Promise<string> {
    const key = await getCryptoKey();
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const ciphertext = await globalThis.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(data))
    );

    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const ctBytes = new Uint8Array(ciphertext);
    const ctHex = Array.from(ctBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${ivHex}:${ctHex}`;
}

/**
 * Decrypts a secure token string back into its original payload.
 * Returns null if decryption or signature verification fails.
 */
export async function decryptSession(token: string): Promise<any> {
    try {
        const [ivHex, ctHex] = token.split(':');
        if (!ivHex || !ctHex) return null;

        // Convert hex strings back to Uint8Arrays
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const ciphertext = new Uint8Array(ctHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

        const key = await getCryptoKey();
        const decrypted = await globalThis.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decrypted));
    } catch (error) {
        // Safe rejection for tampering/invalid keys
        return null;
    }
}
