const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from("4a8f92d7b6e35c8a1f2d47e9c6b0517ad4e39f8c2b7d1e5f3a6c8d9e1b2f47ca", "hex");
const iv = Buffer.from("3e9a5b7c1d4f6e8a2c3d7f9b0a1e2d4c", "hex");

const encryptPlaintext = (plaintext) => {
    try {
        if (typeof plaintext !== "string") throw new Error("Plaintext must be a string");

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(plaintext, "utf8", "base64");
        encrypted += cipher.final("base64");

        return encrypted; // No need to include IV since it's fixed
    } catch (error) {
        console.error("Encryption error:", error.message);
        return null;
    }
};

const decryptCiphertext = (ciphertext) => {
    try {
        if (typeof ciphertext !== "string" || ciphertext.length === 0) throw new Error("Ciphertext must be a non-empty string");

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(ciphertext, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error.message);
        return null;
    }
};

module.exports = { encryptPlaintext, decryptCiphertext };
