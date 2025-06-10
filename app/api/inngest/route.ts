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
import { logPasswordResetRequested } from "@/inngest/functions/logPasswordResetRequested";
import { logUserRegistered } from "@/inngest/functions/logUserRegistered";
import { logEmailVerification } from "@/inngest/functions/logEmailVerification";
import { logPasswordReset } from "@/inngest/functions/logPasswordReset";
import { logUserCreatedViaInvite } from "@/inngest/functions/logUserCreatedViaInvite";
import { logInvitationCreated } from "@/inngest/functions/logInvitationCreated";
import { categoryArchivedAll } from "@/inngest/functions/category-archived";
import { logContactCreation } from "@/inngest/functions/contact-log";
import { logOrganisationCreation } from "@/inngest/functions/organisation-log";
import { logDevisUpdate } from "@/inngest/functions/logDevisUpdate";
import { logDevisCreation } from "@/inngest/functions/logDevisCreation";
import { logDevisCreations } from "@/inngest/functions/logDevisCreations";
import { inviteArchived } from "@/inngest/functions/inviteArchived";
import { roleAndAccessUpdatedHandler } from "@/inngest/functions/roleAndAccessUpdatedHandler";
import { logInvitationSent } from "@/inngest/functions/sent";
import { logProductCreated } from "@/inngest/functions/created";
import { logProductArchived } from "@/inngest/functions/archived";
import { createActivityLog } from "@/inngest/functions/create-activity-log";
import { logContactUpdate } from "@/inngest/functions/logContactUpdate";
import { logContactArchived } from "@/inngest/functions/logContactArchived";
import { logUserEmailVerified } from "@/inngest/functions/email-verified";
import { stepAddedWorkflow } from "@/inngest/functions/stepcreation";
import { dealStageDeletedWorkflow } from "@/inngest/functions/stepdelete";
import { taskAddedWorkflow } from "@/inngest/functions/taskAddedWorkflow";
import { contactImageDeletedWorkflow } from "@/inngest/functions/contactImageDeletedWorkflow";
import { logContactUpdated } from "@/inngest/functions/updatecontactincontact";
import { logFeedbackCreated } from "@/inngest/functions/feedback";
import { logNoteDeleted } from "@/inngest/functions/deletenote";
import { logNoteCreated } from "@/inngest/functions/createNote";
import { logNoteUpdated } from "@/inngest/functions/updatenote";
import { logDevisCreatedmannuellement } from "@/inngest/functions/createdevis";
import { logDevisCreatedByia } from "@/inngest/functions/logDevisCreated";
import { logDealCreated, logMerchantCreated } from "@/inngest/functions/deals";
import { logStepUpdated } from "@/inngest/functions/logstepudpate";
// Expose les fonctions via le handler Inngest
export const { GET, POST, PUT } = serve({
  client: inngest, // L'instance du client
  functions: [
    logBrandCreated,
    logDevisCreation,
    logNoteUpdated,
    logDealCreated,
    logStepUpdated,
    logMerchantCreated,
    logContactArchived,
    logDevisCreations,
    inviteArchived,
    createActivityLog, 
   logProductArchived,
    categoryArchivedAll,
    roleAndAccessUpdatedHandler,
    logInvitationSent,
    logUserLogin,
    logDevisUpdate,
    logProductCreated,
    logNoteCreated,
    logContactUpdated,
    logFeedbackCreated,
   contactImageDeletedWorkflow,
    stepAddedWorkflow,
    logContactUpdate,
    dealStageDeletedWorkflow,
    logOrganisationCreation,
    logPasswordResetRequested,
    logTaskStatusUpdated,
    logEmailVerification,
    taskAddedWorkflow,
    logInvitationCreated,
    logPasswordReset,
    logUserCreatedViaInvite,
    logNoteCollaboratorAdded,
    logUserEmailVerified,
    logFavoriteAdded, 
    logCategoryUpdated,
    logCategoryArchived, // Assurez-vous que cette fonction n'est présente qu'une seule fois
    logFavoriteRemoved,
    logBrandArchived,
    logBrandUpdated,
    logSubCategoryCreated,
    logCategoryCreated,
    logUserRegistered,
    logDevisCreatedByia,
    logDevisCreatedmannuellement,
    logInvitationAccepted, // ajoute toutes tes fonctions ici
    logContactCreation,
  ],
});