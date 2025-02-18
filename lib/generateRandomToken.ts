import crypto from "crypto";

export function generateRandomToken (): string {

const token = crypto.randomBytes(32).toString("hex");

return token
}