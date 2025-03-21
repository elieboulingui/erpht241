import React from "react";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Directly render the children
  return (
    <div className=" w-full">
   
        <main>{children}</main>
    </div>
  );
}
