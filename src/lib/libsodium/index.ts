import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default class Libsodium {
    readonly sodium: typeof import('libsodium-wrappers');
    constructor() {
        this.sodium = require('libsodium-wrappers');
    }

    async validate_password(password: string, hashed_password: string, private_key: string, public_key: string) {

    }
}