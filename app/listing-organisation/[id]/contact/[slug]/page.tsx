import React from "react";
import ContactDetails from "./components/ContactDetails";
import ContactInfo from "./components/ContactInfo";
import ContactDetailsHeader from "./components/ContactDetailsHeader";

export default function page() {
  return (
    <div>
      {/* <ContactDetails  /> */}
      <ContactDetailsHeader />

      <ContactInfo />
    </div>
  );
}
