"use client"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateUserRoleAndAccess } from "../actions/updateUserRoleAndAccess";
import { getinviteByOrganisationId } from "../actions/GetAllinviteuser";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"; 
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { archiveInviteByEmail } from "../actions/deleteInviteById";

interface InvitedBy {
  name: string | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  accessType: string;  
  acceptedAt?: Date | null;
  invitedBy: InvitedBy;
}

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
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [currentInvite, setCurrentInvite] = useState<Invitation | null>(null);

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

  const handleDeleteInvite = async (inviteEmail: string) => {
    try {
      await archiveInviteByEmail(inviteEmail, orgId as string);
      setInvitations((prevInvites) => prevInvites.filter((invite) => invite.email !== inviteEmail));
    } catch (error) {
      console.error("Error deleting invite:", error);
    }
  };

  const handleUpdateInviteRoleAndAccess = async (inviteId: string, newRole: string, newAccessType: string) => {
    try {
      const updatedInvite = await updateUserRoleAndAccess(inviteId, orgId as string, newRole as any, newAccessType as any);
      setInvitations((prevInvites) =>
        prevInvites.map((invite) =>
          invite.id === inviteId ? { ...invite, role: updatedInvite.role, accessType: updatedInvite.accessType } : invite
        )
      );
      setSheetOpen(false);
    } catch (error) {
      console.error("Error updating invite role and access:", error);
    }
  };

  const openPopup = (invitation: Invitation) => {
    setCurrentInvite(invitation);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Access Type</TableHead>
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
                  {/* More Options Button (dots) */}
                  <button 
                    className="px-2 py-2 text-lg text-gray-500" 
                    onClick={() => openPopup(invitation)}
                  >
                    <span>...</span>
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

      {/* Popup for "Edit" and "Delete" actions */}
      {popupOpen && currentInvite && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold">Options</h3>
            <div className="mt-4">
              <button
                className="px-4 py-2 text-sm bg-black text-white rounded-md w-full mb-2"
                onClick={() => {
                  setPopupOpen(false);
                  setSheetOpen(true);
                  setSelectedInvitation(currentInvite);
                }}
              >
                Edit Role and Access
              </button>
              <button
                className="px-4 py-2 text-sm bg-black text-white rounded-md w-full"
                onClick={() => {
                  handleDeleteInvite(currentInvite.email);
                  setPopupOpen(false);
                }}
              >
                Delete Invite
              </button>
              <div className="mt-4 text-center">
                <button
                  className="text-sm text-gray-500"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <SelectContent>
                    <SelectItem value="READ">Read</SelectItem>
                    <SelectItem value="WRITE">Write</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-full items-center justify-between mt-4">
                <Button
                  className="bg-black w-full hover:bg-black text-white py-2 px-4"
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
