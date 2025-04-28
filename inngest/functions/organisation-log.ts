import { inngest } from "@/inngest/client";

export const logOrganisationCreation = inngest.createFunction(
  { id: "log-organisation-creation", name: "Log: Organisation Created" },
  { event: "organisation/created" },
  async ({ event, step }) => {
    const { organisation, userId } = event.data;

    await step.run("log-organisation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Organisation",
          entityId: organisation.id,
          newData: JSON.stringify(organisation),
          userId: userId,
          organisationId: organisation.id,
          createdByUserId: userId,
          actionDetails: `Création de l'organisation ${organisation.name}`,
          entityName: organisation.name,
        },
      });
    });
  }
);
