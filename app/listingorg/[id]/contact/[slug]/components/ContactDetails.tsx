"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActivitySquare, FileText, ListTodo, SmilePlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GetcontactDetails } from "../actions/GetcontactDetails";

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  icon?: string | JSX.Element;
  stage: string;
  tags: string[];
  record: string;
}

interface ContactDetailsProps {
  contact: Contact | null | undefined;
}

interface FieldChange {
  field: string;
  from: string;
  to: string;
}

interface Activity {
  id: string;
  type: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  timestamp: string;
  changes: FieldChange[];
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  const [activeTab, setActiveTab] = useState("activity");
  const [comment, setComment] = useState("");
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<Contact | null>(null); // Nouvel état pour stocker les détails du contact

  const TABS = [
    {
      id: "activity",
      label: "Activity",
      icon: <ActivitySquare className="h-4 w-4" />,
    },
    { id: "devis", label: "Devis", icon: <ListTodo className="h-4 w-4" /> },
    {
      id: "factures",
      label: "Factures",
      icon: <ListTodo className="h-4 w-4" />,
    },
    { id: "notes", label: "Notes", icon: <FileText className="h-4 w-4" /> },
    { id: "tasks", label: "Tasks", icon: <ListTodo className="h-4 w-4" /> },
  ];

  const activity: Activity = {
    id: "1",
    type: "created the contact",
    user: {
      name: "Gabin Moundziepou",
      avatar: "",
      initials: "GM",
    },
    timestamp: "about 1 month ago",
    changes: [
      { field: "Name", from: "Empty", to: "Airbnb" },
      { field: "Tags", from: "Empty", to: "B2C, Internet, Web Services" },
      { field: "Email", from: "Empty", to: "press@airbnb.com" },
      { field: "Image", from: "Empty", to: "https://dashboard.demo-v2.ac..." },
      { field: "Phone", from: "Empty", to: "+1 415-800-5959" },
      { field: "Stage", from: "Empty", to: "Lead" },
      { field: "Record", from: "Empty", to: "Company" },
      {
        field: "Address",
        from: "Empty",
        to: "888 Brannan Street, San Francisco",
      },
    ],
  };

  // Sécurisation de l'objet `contact` en cas de null ou undefined
  const safeContact = contactDetails || {
    name: 'Default Name',
    email: '',
    phone: '',
    address: '',
    logo: '',
    icon: <User className="h-4 w-4" />,
    stage: 'Lead',
    tags: [],
    record: 'Default Record',
  };

  // Extract the contact ID from the URL dynamically
  useEffect(() => {
    const url = window.location.href;
    const regex = /\/contact\/([a-zA-Z0-9]+)/; // Récupère l'ID du contact depuis l'URL
    const match = url.match(regex);
  
    if (match) {
      setContactId(match[1]);  // Définit l'ID du contact
      // Appel de l'API GetcontactDetails avec l'ID du contact
      GetcontactDetails(match[1]).then((data) => {
        // Transformez les données pour correspondre à l'interface Contact
        const transformedData: Contact = {
          name: data.name,
          email: data.email,
          phone: data.phone ?? "", // Assurez-vous que `phone` n'est jamais `null`
          address: data.Adresse ?? "", // Transformez `Adresse` en `address`
          logo: data.logo ?? "", // Assurez-vous que `logo` n'est jamais `null`
          icon: <User className="h-4 w-4" />, // Par défaut, utilisez une icône générique
          stage: data.stage ?? "Lead", // Si `stage` est `null`, utilisez "Lead" par défaut
          tags: data.tabs ? [data.tabs] : [], // `tabs` peut être une liste de tags, sinon un tableau vide
          record: data.Record ?? "Default Record", // Si `Record` est `null`, utilisez un enregistrement par défaut
        };
        setContactDetails(transformedData); // Met à jour les détails du contact avec les données transformées
      }).catch((error) => {
        console.error("Erreur lors de la récupération des détails du contact:", error);
      });
    } else {
      console.log('Contact ID not found.');
    }
  }, []);
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-full max-w-[400px] p-6">
        <div className="space-y-0">
          <div className="flex justify-center">
            {safeContact.logo ? (
              <img
                src={safeContact.logo}
                alt={safeContact.name}
                width={100}
                height={100}
                className="h-36 w-36 text-white p-6"
              />
            ) : (
              <div className="text-center p-6">{safeContact.icon}</div>
            )}
          </div>
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Properties</h2>
            <button className="text-sm text-muted-foreground">Edit</button>
          </div>
        </div>

        <div className="space-y-6 mt-2">
          {/* Properties */}
          <div className="grid gap-4">
            {[
              {
                icon: <Building2 className="h-4 w-4" />,
                label: "Record",
                value: safeContact.record,
              },
              {
                icon: <User className="h-4 w-4" />,
                label: "Name",
                value: safeContact.name,
              },
              {
                icon: <Mail className="h-4 w-4" />,
                label: "Email",
                value: safeContact.email,
              },
              {
                icon: <Phone className="h-4 w-4" />,
                label: "Phone",
                value: safeContact.phone,
              },
              {
                icon: <MapPin className="h-4 w-4" />,
                label: "Address",
                value: safeContact.address,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[16px_100px_1fr] items-center gap-2"
              >
                {item.icon}
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm">{item.value}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4 w-full" />

          {/* Stage */}
          <div className="space-y-2">
            <h3 className="font-medium">Stage</h3>
            <Select defaultValue={safeContact.stage}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4 w-full" />

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {safeContact.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer gap-1 pr-1"
                >
                  {tag}
                  <button className="rounded-full hover:bg-secondary-foreground/10">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Type your tag and press enter"
              className="mt-2"
            />
          </div>

          <Separator className="my-4 w-full" />
        </div>
      </div>

      <div className="border-l border-gray-800"></div>

      {/* Main Content */}
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-4 border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 py-2  ml-8 transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className=" px-8 mt-6">
          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className="flex  gap-4">
                <Avatar className="h-8 w-8 bg-primary/10 mt-2 flex items-center justify-center">
                  <span className="text-xs">GM</span>
                </Avatar>

                <div className="w-full flex flex-col gap-2">
                  <div className="relative max-w-md border rounded-lg otline-none p-2">
                    <Textarea
                      placeholder="Leave a comment..."
                      className="w-full min-h-[80px]  border-none "
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent"
                        size="sm"
                      >
                        <SmilePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="px-4"
                        disabled={!comment.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>

                  {/* Show comments checkbox properly aligned */}
                  <div className="flex items-center gap-2">
                    <Checkbox id="show-comments" />
                    <label
                      htmlFor="show-comments"
                      className="text-sm text-muted-foreground"
                    >
                      Show comments
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 ">
                <div className="flex gap-4 mt-10">
                  <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">{activity.user.initials}</span>
                  </Avatar>
                  <div className="">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        {activity.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {activity.type}
                      </span>
                    </div>
                    <div className="mt-2 rounded-lg border p-4">
                      {activity.changes.map((change, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[100px_1fr_auto_1fr] items-center gap-2 py-1 text-sm"
                        >
                          <span className="font-medium">{change.field}</span>
                          <span className="text-muted-foreground line-through">
                            {change.from}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span>{change.to}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center">
                      {activity.timestamp}

                      <Button variant={"ghost"} size={"icon"}>
                        <IoMdInformationCircleOutline
                          className="h-4 w-4"
                          color="gray"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {TABS.filter((tab) => tab.id !== "activity").map(
            (tab) =>
              activeTab === tab.id && (
                <div key={tab.id} className="text-center text-muted-foreground">
                  No {tab.label.toLowerCase()} yet
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
