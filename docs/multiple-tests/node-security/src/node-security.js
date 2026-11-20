var crypto = require("crypto");
var https = require("https");

function digest(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function encrypt(key, data) {
  var cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return cipher.update(data);
}

function fetchInsecure(url) {
  return https.get(url, { rejectUnauthorized: false });
}

async function withCleanup(work, done) {
  try {
    await work();
  } finally {
    done();
  }
}

module.exports = { digest, encrypt, fetchInsecure, withCleanup };
