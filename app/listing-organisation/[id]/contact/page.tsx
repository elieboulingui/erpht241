import React from "react";
import ContactdHeader from "@/app/listing-organisation/[id]/contact/components/ContactHeader";
import ContactsTables from "./components/ContactsTables";

export default function page() {
  return (
    <div>
      <ContactdHeader />
      <ContactsTables />
    </div>
  );
}
