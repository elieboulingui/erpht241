"use client";

import { useState, lazy, Suspense } from "react";
import {
  Activity,
  FileText,
  CheckSquare,
  TrendingUpIcon as TrendingUpDown,
  Building2,
  Truck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Contact } from "@/contact";
import Chargement from "@/components/Chargement";
import { LogInterface } from "./logInterface";

// Chargement paresseux des composants
const TabsDevis = lazy(() => import("./TabsDevis"));
const TabsFacture = lazy(() => import("./TabsFacture"));
const NotesApp = lazy(() => import("./notes-app"));
const TaskManager = lazy(() => import("./task-manager"));
const Command = lazy(() => import("./Command"));
const Crm = lazy(() => import("./Crm"));

interface ContactTabsProps {
  contact: Contact;
  setShowLeftPanel: (show: boolean) => void;
}

type ActivityType = "comment" | "update" | "creation";

interface ActivityItem {
  id: string;
  type: ActivityType;
  text?: string;
  user: string;
  timestamp: Date;
  oldValues?: Record<string, string>;
  newValues?: Record<string, string>;
  createdFields?: Record<string, string>;
}

export function ContactTabs({ contact, setShowLeftPanel }: ContactTabsProps) {
  const [activeTab, setActiveTab] = useState("activity");
  const [activityType, setActivityType] = useState<ActivityType>("comment");
  const [comment, setComment] = useState("");
  const [activities, setActivities] = useState<Array<ActivityItem>>([]);
  const [showActivities, setShowActivities] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Pour les mises à jour
  const [updateFields, setUpdateFields] = useState<
    { oldValue: string; newValue: string; fieldName: string }[]
  >([{ oldValue: "", newValue: "", fieldName: "" }]);

  // Pour les créations
  const [creationFields, setCreationFields] = useState<
    { fieldName: string; value: string }[]
  >([{ fieldName: "", value: "" }]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowLeftPanel(value === "activity");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activity":
        return (
          <TabsContent value="activity" className="p-4 mt-0 ">
            {/* <div className="mb-4">
              <div className="flex mt-3">
                <Avatar className="h-10 w-10 bg-gray-200 p-2.5 mr-2 shrink-0">
                  {contact.name.slice(0, 2).toUpperCase()}
                </Avatar>
                <div className="w-full">
                  <div className="mb-3 flex justify-end">
                    <Select
                      value={activityType}
                      onValueChange={(value) =>
                        setActivityType(value as ActivityType)
                      }
                    >
                      <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Type d'activité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comment">
                          <div className="flex items-center">
                            <MessageSquare size={16} className="mr-2" />
                            <span>Commentaire</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="update">
                          <div className="flex items-center">
                            <Edit size={16} className="mr-2" />
                            <span>Modification</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="creation">
                          <div className="flex items-center">
                            <PlusCircle size={16} className="mr-2" />
                            <span>Création</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card>
                    <CardContent className="p-3">
                      {renderActivityForm()}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end mt-3">
                    <Button
                      size="sm"
                      className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg "
                      onClick={handlePostActivity}
                    >
                      Enregistrer l'activité
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-activities"
                    checked={showActivities}
                    onCheckedChange={(checked) => setShowActivities(!!checked)}
                  />
                  <label
                    htmlFor="show-activities"
                    className="text-sm cursor-pointer"
                  >
                    Afficher les activités
                  </label>
                </div>
              </div>

              {showActivities && activities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Historique des activités
                  </h3>
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div key={activity.id}>
                        {renderActivityItem(activity)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div> */}

            <LogInterface />

          </TabsContent>
        );

      case "devis":
        return (
          <TabsContent value="devis" className="p-4">
            <Suspense fallback={<Chargement />}>
              <TabsDevis />
            </Suspense>
          </TabsContent>
        );

      case "facture":
        return (
          <TabsContent value="facture" className="p-4">
            <Suspense fallback={<Chargement />}>
              <TabsFacture />
            </Suspense>
          </TabsContent>
        );

      case "notes":
        return (
          <TabsContent value="notes" className="p-4">
            <Suspense fallback={<Chargement />}>
              <NotesApp />
            </Suspense>
          </TabsContent>
        );

      case "tasks":
        return (
          <TabsContent value="tasks" className="p-4">
            <Suspense fallback={<Chargement />}>
              <TaskManager />
            </Suspense>
          </TabsContent>
        );


      case "command":
        return (
          <TabsContent value="command" className="p-4">
            <Suspense fallback={<Chargement />}>
              <Command />
            </Suspense>
          </TabsContent>
        );


      case "crm" :
        return (
          <TabsContent value="crm" className="p-4">
            <Suspense fallback={<Chargement />}>
              <Crm />
            </Suspense>
          </TabsContent>
        )

      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
          <TabsTrigger
            value="activity"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "activity" ? "bg-gray-100" : ""
              }`}
          >
            <Activity size={16} className="mr-2" />
            Activité
          </TabsTrigger>
          <TabsTrigger
            value="devis"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "devis" ? "bg-gray-100" : ""
              }`}
          >
            <TrendingUpDown size={16} className="mr-2" />
            Devis
          </TabsTrigger>
          <TabsTrigger
            value="facture"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "facture" ? "bg-gray-100" : ""
              }`}
          >
            <Building2 size={16} className="mr-2" />
            Facture
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "notes" ? "bg-gray-100" : ""
              }`}
          >
            <FileText size={16} className="mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "tasks" ? "bg-gray-100" : ""
              }`}
          >
            <CheckSquare size={16} className="mr-2" />
            Tâches
          </TabsTrigger>
          <TabsTrigger
            value="command"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "command" ? "bg-gray-100" : ""
              }`}
          >
            <Truck size={16} className="mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger
            value="crm"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${activeTab === "crm" ? "bg-gray-100" : ""
              }`}
          >
            {/* <CRM size={16} className="mr-2" /> */}
            CRM
          </TabsTrigger>
        </TabsList>

        <Separator />

        {renderTabContent()}
      </Tabs>
    </div>
  );
}