"use client";
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
import { updateUserRoleAndAccess } from "../actions/updateUserRoleAndAccess";
import { getinviteByOrganisationId } from "../actions/GetAllinviteuser";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"; // Import ShadCN components
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { archiveInviteByEmail } from "../actions/deleteInviteById";

// Define types for invitation and invitedBy objects
interface InvitedBy {
  name: string | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  accessType: string;  // Added accessType field
  acceptedAt?: Date | null;
  invitedBy: InvitedBy;
}

// Function to extract ID from URL using regex
function getIdFromUrl(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9]+)\/invite-member/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export function TableDemo() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState<boolean>(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const id = getIdFromUrl(currentUrl);
    setOrgId(id);

    if (id) {
      async function fetchInvites() {
        try {
          const invitesData = await getinviteByOrganisationId(id as any);
          setInvitations(invitesData);
        } catch (error) {
          console.error("Error fetching invites:", error);
        }
      }

      fetchInvites();
    }
  }, []);

  // Function to handle invite deletion by email
  const handleDeleteInvite = async (inviteEmail: string) => {
    try {
      await archiveInviteByEmail(inviteEmail, orgId as string); // Pass the email to delete by email
      setInvitations((prevInvites) => prevInvites.filter((invite) => invite.email !== inviteEmail)); // Filter out the invite with the same email
    } catch (error) {
      console.error("Error deleting invite:", error);
    }
  };

  // Function to handle role and access type update
  const handleUpdateInviteRoleAndAccess = async (inviteId: string, newRole: string, newAccessType: string) => {
    try {
      // Now passing both role and accessType to the function
      const updatedInvite = await updateUserRoleAndAccess(inviteId, orgId as string, newRole as any, newAccessType as any);
      setInvitations((prevInvites) =>
        prevInvites.map((invite) =>
          invite.id === inviteId ? { ...invite, role: updatedInvite.role, accessType: updatedInvite.accessType } : invite
        )
      );
      setSheetOpen(false); // Close the sheet after update
    } catch (error) {
      console.error("Error updating invite role and access:", error);
    }
  };

  // Open the sheet with invitation details
  const openSheet = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setSheetOpen(true);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Access Type</TableHead> {/* New column for access type */}
            <TableHead className="text-right">Invited By</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>{invitation.acceptedAt ? "Accepted" : "Pending"}</TableCell>
                
                {/* Role Display and Update */}
                <TableCell>
                  <span>{invitation.role}</span>
                </TableCell>

                {/* Access Type Display and Update */}
                <TableCell>
                  <span>{invitation.accessType}</span>
                </TableCell>
                
                <TableCell className="text-right">{invitation.invitedBy.name || "N/A"}</TableCell>
                <TableCell className="text-center">
                  <button
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
                    onClick={() => openSheet(invitation)}
                  >
                    Edit Role and Access
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-md ml-2"
                    onClick={() => handleDeleteInvite(invitation.email)} // Pass email to delete function
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No invitations found.</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Invitations</TableCell>
            <TableCell className="text-right">{invitations.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* ShadCN Sheet for editing invitation details */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Invitation</SheetTitle>
            <SheetDescription>Update the role and access type for this invitation.</SheetDescription>
          </SheetHeader>

          {selectedInvitation && (
            <div className="space-y-4">
              <div>
                <label>Email:</label>
                <p>{selectedInvitation.email}</p>
              </div>

              <div>
                <label>Role:</label>
                <Select
                  value={selectedInvitation.role}
                  onValueChange={(value: string) => 
                    setSelectedInvitation({
                      ...selectedInvitation,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  {/* Wrap SelectItem in SelectContent */}
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label>Access Type:</label>
                <Select
                  value={selectedInvitation.accessType}
                  onValueChange={(value: string) =>
                    setSelectedInvitation({
                      ...selectedInvitation,
                      accessType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access type" />
                  </SelectTrigger>
                  {/* Wrap SelectItem in SelectContent */}
                  <SelectContent>
                    <SelectItem value="READ">Read</SelectItem>
                    <SelectItem value="WRITE">Write</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-full items-center justify-between mt-4">
                <Button
                  className="bg-black  w-full hover:bg-black text-white py-2 px-4"
                  onClick={() => {
                    if (selectedInvitation) {
                      handleUpdateInviteRoleAndAccess(
                        selectedInvitation.id,
                        selectedInvitation.role,
                        selectedInvitation.accessType
                      );
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
