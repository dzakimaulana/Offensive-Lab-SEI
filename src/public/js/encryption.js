function encPlaintext(event) {
    event.preventDefault();

    const key = CryptoJS.enc.Hex.parse("4a8f92d7b6e35c8a1f2d47e9c6b0517ad4e39f8c2b7d1e5f3a6c8d9e1b2f47ca");
    const iv = CryptoJS.enc.Hex.parse("3e9a5b7c1d4f6e8a2c3d7f9b0a1e2d4c");

    let passwordField = document.getElementById("password");
    let plaintext = passwordField.value;

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let encryptedPassword = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    passwordField.value = encryptedPassword;
    event.target.submit();
}
