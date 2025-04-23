// /app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client"; // L'instance du client Inngest

// 👉 Importe toutes tes fonctions Inngest ici
import { logBrandCreated } from "@/inngest/functions/logBrandCreated";
import { logBrandUpdated } from "@/inngest/functions/logBrandUpdated";
import { logInvitationAccepted } from "@/inngest/functions/logInvitationAccepted"; // si tu l'as
import { logFavoriteAdded } from "@/inngest/functions/logFavoriteAdded";
import { logFavoriteRemoved } from "@/inngest/functions/logFavoriteRemoved";
import { logBrandArchived } from "@/inngest/functions/logBrandArchived";
import { logUserLogin } from "@/inngest/functions/logUserLogin";

// Expose les fonctions via le handler Inngest
export const { GET, POST, PUT } = serve({
  client: inngest, // L'instance du client
  functions: [
    logBrandCreated,
    logUserLogin,
    logFavoriteAdded,
    logFavoriteRemoved,
    logBrandArchived,
    logBrandUpdated,
    logInvitationAccepted, // ajoute toutes tes fonctions ici
    logFavoriteAdded
  ],
});
