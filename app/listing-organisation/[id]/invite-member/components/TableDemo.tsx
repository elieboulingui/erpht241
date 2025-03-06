"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getinviteByOrganisationId } from "../actions/GetAllinviteuser"; // assuming this fetches the data

// Define types for invitation and invitedBy objects
interface InvitedBy {
  name: string | null; // Allow name to be either string or null
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  acceptedAt?: Date | null; // Accepted date might be null if not accepted
  invitedBy: InvitedBy; // Assuming invitedBy is an object containing a name
}

// Function to extract ID from URL using regex
function getIdFromUrl(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9]+)\/invite-member/; // Regex to match the ID pattern
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1]; // Return the ID captured by the regex
  }

  return null; // Return null if no ID was found
}

export function TableDemo() {
  const [invitations, setInvitations] = useState<Invitation[]>([]); // Initialize state for invitations with the correct type
  const [orgId, setOrgId] = useState<string | null>(null); // Initialize state for the organisation ID

  // Fetch the invites when the component mounts
  useEffect(() => {
    // Extract the ID from the URL
    const currentUrl = window.location.href; // Get the current URL
    const id = getIdFromUrl(currentUrl); // Get the ID from the URL
    setOrgId(id); // Update the state with the extracted ID

    if (id) {
      async function fetchInvites() {
        try {
          // Fetch the invites data using the organisation ID
          const invitesData = await getinviteByOrganisationId(id as any);
          setInvitations(invitesData); // Update the state with the fetched data
        } catch (error) {
          console.error("Error fetching invites:", error);
        }
      }

      fetchInvites();
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
     {/* Display the extracted organisation ID */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Invited By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>{invitation.acceptedAt ? "Accepted" : "Pending"}</TableCell>
                <TableCell>{invitation.role}</TableCell>
                <TableCell className="text-right">{invitation.invitedBy.name || "N/A"}</TableCell> {/* Handling null name */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No invitations found.</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Invitations</TableCell>
            <TableCell className="text-right">{invitations.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
