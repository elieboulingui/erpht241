import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActivitySquare, FileText, ListTodo, SmilePlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { JSX } from "react";
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
  contact: Contact;
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
      { field: "Tags", from: "Empty", to: "B2C,Internet,Web Services & A..." },
      { field: "Email", from: "Empty", to: "press@airbnb.com" },
      { field: "Image", from: "Empty", to: "https://dashboard.demo-v2.ac..." },
      { field: "Phone", from: "Empty", to: "+1 415-800-5959" },
      { field: "Stage", from: "Empty", to: "Lead" },
      { field: "Record", from: "Empty", to: "Company" },
      {
        field: "Address",
        from: "Empty",
        to: "888 Brannan Street, San Franci...",
      },
    ],
  };
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Contacts</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{contact.name}</span>
        </div>
      </header>
      <div className="flex gap-8 ">
        <Card className="w-full max-w-[400px] flex-1">
          <CardHeader className="space-y-0">
            <div className=" flex justify-center">
              {contact.logo ? (
                <Image
                  src={contact.logo}
                  alt={contact.name}
                  width={100}
                  height={100}
                  className="h-36 w-36 text-white p-6"
                />
              ) : (
                <div className="text-center p-6">{contact.icon}</div>
              )}
            </div>

            <div className="gap-4 flex justify-between">
              <h2 className="text-lg font-semibold">Properties</h2>

              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-[16px_100px_1fr] items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Record</span>
                <span className="text-sm">{contact.record}</span>
              </div>
              <div className="grid grid-cols-[16px_100px_1fr] items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm">{contact.name}</span>
              </div>
              <div className="grid grid-cols-[16px_100px_1fr] items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">{contact.email}</span>
              </div>
              <div className="grid grid-cols-[16px_100px_1fr] items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm">{contact.phone}</span>
              </div>
              <div className="grid grid-cols-[16px_100px_1fr] items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-sm">{contact.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Stage</h3>
              <Select defaultValue={contact.stage}>
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

            <div className="space-y-2">
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
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
          </CardContent>
        </Card>

        <Card className="p-6">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <span className="text-xs">GM</span>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Leave a comment..."
                      className="min-h-[80px] resize-none"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <Button variant="ghost" size="sm">
                        <SmilePlus className="h-4 w-4" />
                      </Button>
                      <Button size="sm">Post</Button>
                    </div>
                  </div>
                </div>

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

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <span className="text-xs">{activity.user.initials}</span>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user.name}</span>
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
                    <div className="mt-1 text-xs text-muted-foreground">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="text-center text-muted-foreground">
                No notes yet
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="text-center text-muted-foreground">
                No tasks yet
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
