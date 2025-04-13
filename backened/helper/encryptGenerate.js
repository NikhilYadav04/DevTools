import crypto from "crypto";

export function generateEncryptedID() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const hash = crypto
    .createHash("sha256")
    .update(randomNum.toString())
    .digest("hex");

  return hash.substring(0, 5);
}
