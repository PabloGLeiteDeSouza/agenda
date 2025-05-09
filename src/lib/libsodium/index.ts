import Sodium from 'libsodium-wrappers';

export default class Libsodium {
    sodium: typeof import("libsodium-wrappers");
    constructor() {
        this.sodium = Sodium;
    }

    async generate_key_pair() {
        const keyPair = this.sodium.crypto_box_keypair();
        return { private_key: this.sodium.to_hex(keyPair.privateKey), public_key: this.sodium.to_hex(keyPair.publicKey) };
    }

    private async ecrypt_password_key_pair(password: string, privateKey: string, publicKey: string) {
        await this.sodium.ready;
        const private_key = this.sodium.from_hex(privateKey);
        const public_key = this.sodium.from_hex(publicKey);
        const nonce = this.sodium.randombytes_buf(this.sodium.crypto_secretbox_NONCEBYTES);
        const encrypted_password = this.sodium.crypto_box_easy(password, nonce, private_key, public_key);
        return this.sodium.to_hex(new Uint8Array([...nonce, ...encrypted_password]));
    }

    private async decrypt_password_key_pair(encrypted_password: string, privateKey: string, publicKey: string) {
        await this.sodium.ready;
        const private_key = this.sodium.from_hex(publicKey);
        const public_key = this.sodium.from_hex(privateKey);
        const encrypted_password_bytes = this.sodium.from_hex(encrypted_password);
        const nonce = encrypted_password_bytes.slice(0, this.sodium.crypto_secretbox_NONCEBYTES);
        const encrypted_password_data = encrypted_password_bytes.slice(this.sodium.crypto_secretbox_NONCEBYTES);
        const decrypted_password = this.sodium.crypto_box_open_easy(encrypted_password_data, nonce, private_key, public_key);
        return this.sodium.to_string(decrypted_password);
    }

    async validate_password_keypair(password: string, encrypted_password: string, privateKey: string, publicKey: string) {
        await this.sodium.ready;
        const decrypted_password = await this.decrypt_password_key_pair(encrypted_password, privateKey, publicKey);
        return password === decrypted_password;
    }

    async get_password_key_pair(password: string) {
        await this.sodium.ready;
        const { private_key, public_key } = await this.generate_key_pair();
        const encrypted_password = await this.ecrypt_password_key_pair(password, private_key, public_key);
        return encrypted_password;
    }
}