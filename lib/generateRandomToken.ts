import crypto from "crypto";

export function generateRandomToken(): string {
  // Générer un code hexadécimal de 5 caractères uniques
  const code = crypto.randomBytes(3).toString("hex").slice(0, 5); // Utilise 3 octets et limite à 5 caractères
  return code.toUpperCase(); // Pour garantir que les codes sont en majuscules
}
