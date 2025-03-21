const sodium = require('libsodium-wrappers');
const umbral = require('umbral-pre');

/**
 * Encrypts data using a public key.
 * @param {string} data - The data to encrypt.
 * @param {Buffer} publicKey - The public key used for encryption.
 * @returns {Object} - An object containing the encrypted data and nonce.
 */
const encryptData = async (data, publicKey) => {
  await sodium.ready; // Ensure sodium is ready
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES); // Generate a random nonce
  const encrypted = sodium.crypto_secretbox_easy(
    Buffer.from(data), // Convert data to Buffer
    nonce, // Use the generated nonce
    publicKey // Use the provided public key
  );
  return { encrypted, nonce }; // Return encrypted data and nonce
};

/**
 * Decrypts data using a secret key and nonce.
 * @param {Buffer} encryptedData - The encrypted data to decrypt.
 * @param {Buffer} nonce - The nonce used during encryption.
 * @param {Buffer} secretKey - The secret key used for decryption.
 * @returns {Buffer} - The decrypted data.
 */
const decryptData = async (encryptedData, nonce, secretKey) => {
  await sodium.ready; // Ensure sodium is ready
  const decrypted = sodium.crypto_secretbox_open_easy(
    encryptedData, // The encrypted data
    nonce, // The nonce used during encryption
    secretKey // The secret key
  );
  return decrypted; // Return the decrypted data
};

/**
 * Generates a re-encryption key for delegating access.
 * @param {Buffer} delegatorSecretKey - The secret key of the delegator.
 * @param {Buffer} delegateePublicKey - The public key of the delegatee.
 * @returns {Object} - The re-encryption key.
 */
const generateReEncryptionKey = (delegatorSecretKey, delegateePublicKey) => {
  return umbral.generateReEncryptionKey(delegatorSecretKey, delegateePublicKey);
};

/**
 * Re-encrypts data using a re-encryption key.
 * @param {Buffer} encryptedData - The encrypted data to re-encrypt.
 * @param {Object} reEncryptionKey - The re-encryption key.
 * @returns {Buffer} - The re-encrypted data.
 */
const reEncryptData = (encryptedData, reEncryptionKey) => {
  return umbral.reEncrypt(encryptedData, reEncryptionKey);
};

module.exports = {
  encryptData,
  decryptData,
  generateReEncryptionKey,
  reEncryptData,
};
