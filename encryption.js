const crypto= require('crypto');

function encryptToken(token, secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encryptedToken = cipher.update(token, 'utf8', 'hex');
  encryptedToken += cipher.final('hex');
  return encryptedToken;
}

function decryptToken(encryptedToken, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
  decryptedToken += decipher.final('utf8');
  return decryptedToken;
}

module.exports = { encryptToken, decryptToken };
