import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAdobe, SiDropbox, SiApple, SiIntercom, SiSpotify } from "react-icons/si";
import { TbBrandAirbnb } from "react-icons/tb";
import { SiUnitedairlines } from "react-icons/si";
import { JSX } from "react";

interface Contact {
  name: string;
  visits: number;
  icon?: string | JSX.Element;
  color?: string;
  isUser?: boolean;
  image?: string | JSX.Element | { src: string; className: string };
}

interface ContactsListProps {
  contacts: Contact[];
}

function ContactsList({ contacts }: ContactsListProps) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.name} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {contact.isUser ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {contact.name[0]}
                </span>
              </div>
            ) : contact.image ? (
              typeof contact.image === "object" && "src" in contact.image ? (
                <img
                  src={contact.image.src}
                  className={`h-4 w-4 rounded-md ${contact.image.className}`}
                  alt={contact.name}
                />
              ) : (
                contact.image
              )
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  backgroundColor: typeof contact.icon === "string" ? contact.icon : "#fff",
                }}
              >
                {typeof contact.icon === "object" ? contact.icon : null}
              </div>
            )}
            <span>{contact.name}</span>
          </div>
          <span>{contact.visits}</span>
        </div>
      ))}
    </div>
  );
}

const mostVisitedContacts = [
  { name: "Adobe", visits: 11, icon: <SiAdobe className=" text-white p-1 rounded-lg bg-red-600 h-5 w-5" />},
  { name: "Airbnb", visits: 7, icon: <TbBrandAirbnb className=" text-white p-1 rounded-lg bg-rose-500 h-5 w-5" />},
  { name: "AMD", visits: 4, image: { src: "/images/amd.png", className: " " } },
  { name: "Google", visits: 4, image: { src: "/images//google.png", className: "" } },
  { name: "Microsoft", visits: 3, image: { src: "/images/microsoft.png", className: "" } },
  { name: "Beatrice Richter", visits: 2, isUser: true },
];

const leastVisitedContacts = [
  { name: "United Airlines", icon: <SiUnitedairlines className="h-5 w-5 bg-[#0061FF] text-white" />, visits: 0 },
  { name: "Amazon", image: { src: "/images/amazon-paie (1).png", className: " " } , visits: 0 },
  { name: "Dropbox", icon: <SiDropbox className="text-[#0061FF] h-5 w-5" />, visits: 0 },
  { name: "Apple", icon: <SiApple className="text-[#A2AAAD] h-5 w-5" />, visits: 0 },
  { name: "Intercom", icon: <SiIntercom className="text- h-5 w-4" />, visits: 0 },
  { name: "Spotify", icon: <SiSpotify className="text-[#1DB954] h-5 w-5" />, visits: 0 },
];

export  default function ContactsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 bg-white px-36 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>les contacts les plus visites</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsList contacts={mostVisitedContacts} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>les contacts les moins visites</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsList contacts={leastVisitedContacts} />
        </CardContent>
      </Card>
    </div>
  );
}