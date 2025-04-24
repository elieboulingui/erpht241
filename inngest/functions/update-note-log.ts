import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma"

export const createActivityLog = inngest.createFunction(
  { id: "activity/updatenote.created" },
  { event: "activity/updatenote.created" },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      entityName,
      oldData,
      newData,
      userId,
      createdByUserId,
      organisationId,
      noteId,
      ipAddress,
      userAgent,
      actionDetails,
    } = event.data

    try {
      await prisma.activityLog.create({
        data: {
          action,
          entityType,
          entityId,
          entityName,
          oldData,
          newData,
          userId,
          createdByUserId,
          organisationId,
          noteId,
          ipAddress,
          userAgent,
          actionDetails,
        },
      })

      return { success: true }
    } catch (error) {
      console.error("[INNGEST_ACTIVITY_LOG_ERROR]", error)
      throw error
    }
  }
)
