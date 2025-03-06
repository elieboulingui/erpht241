import React from "react";
import ContactInfo from "./components/ContactInfo";
import ContactDetailsHeader from "./components/ContactDetailsHeader";

export default function page() {
  return (
    <div>
      <ContactDetailsHeader />
      <ContactInfo />
    </div>
  );
}
