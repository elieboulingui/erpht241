import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "erpht241", // le nom de ton app
  eventKey: process.env.INNGEST_EVENT_KEY, // clé API privée
});
