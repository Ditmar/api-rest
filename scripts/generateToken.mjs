import { generateKeyPairSync } from "crypto";
import fs from "fs";
import path from "path";
import "dotenv/config";



const KEYS_DIR = path.resolve("keys");
if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

const passphrase = process.env.RSA_PASSPHRASE;
if (!passphrase) {
  console.error("❌ Error: RSA_PASSPHRASE no definida en .env");
  process.exit(1);
}

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase,
  },
});

fs.writeFileSync(path.join(KEYS_DIR, "private_key.pem"), privateKey, {
  mode: 0o600, // Solo lectura/escritura para el usuario
});
fs.writeFileSync(path.join(KEYS_DIR, "public_key.pem"), publicKey, {
  mode: 0o644, // Lectura para todos, escritura solo para el dueño
});

console.log("✅ Claves RSA generadas y guardadas en 'keys/'");