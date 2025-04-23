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
import { logCategoryCreated } from "@/inngest/functions/logCategoryCreated";
import { logSubCategoryCreated } from "@/inngest/functions/logSubCategoryCreated";
import { logCategoryArchived } from "@/inngest/functions/logCategoryArchived";
import { logCategoryUpdated } from "@/inngest/functions/logCategoryUpdated";
import { logTaskStatusUpdated } from "@/inngest/functions/logTaskStatusUpdated";
import { logNoteCollaboratorAdded } from "@/inngest/functions/logNoteCollaboratorAdded";

// Expose les fonctions via le handler Inngest
export const { GET, POST, PUT } = serve({
  client: inngest, // L'instance du client
  functions: [
    logBrandCreated,
    logUserLogin,
    logTaskStatusUpdated,
    logNoteCollaboratorAdded,
    logFavoriteAdded, 
    logCategoryUpdated,
    logCategoryArchived, // Assurez-vous que cette fonction n'est présente qu'une seule fois
    logFavoriteRemoved,
    logBrandArchived,
    logBrandUpdated,
    logSubCategoryCreated,
    logCategoryCreated,
    logInvitationAccepted, // ajoute toutes tes fonctions ici
  ],
});
