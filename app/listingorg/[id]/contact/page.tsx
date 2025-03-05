import React from "react";
import ContactsTable from "./components/ContactsTable";
import ContactdHeader from "@/app/listingorg/[id]/contact/components/ContactHeader";
import ContactsTables from "./components/ContactsTables";

export default function page() {
  return (
    <div>
      <ContactdHeader />
      {/* <ContactsTable /> */}

      <ContactsTables/>
    </div>
  );
}
