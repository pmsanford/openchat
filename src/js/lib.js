class Cryptor {
    async encrypt(plainText, password) {
        const ptUtf8 = new TextEncoder().encode(plainText);

        const pwUtf8 = new TextEncoder().encode(password);
        const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const alg = { name: 'AES-GCM', iv: iv };
        const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);
        const encBuffer = Array.apply(null, new Uint8Array(await crypto.subtle.encrypt(alg, key, ptUtf8)));
        const serialIv = Array.apply(null, iv);

        return { iv: serialIv, encBuffer };
    }

    async decrypt(payload, password) {
        const { iv, encBuffer } = payload;
        const ctBuffer = new Uint8Array(encBuffer).buffer
        const pwUtf8 = new TextEncoder().encode(password);
        const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

        const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) };
        const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);

        try {
            const ptBuffer = await crypto.subtle.decrypt(alg, key, ctBuffer);
            const plaintext = new TextDecoder().decode(ptBuffer);

            return plaintext;
        }
        catch (error) {
            return null;
        }
    }
}
export default Cryptor;