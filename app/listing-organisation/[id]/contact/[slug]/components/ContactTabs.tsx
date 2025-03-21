"use client";

import { useState, lazy, Suspense } from "react";
import {
  Activity,
  FileText,
  CheckSquare,
  Smile,
  TrendingUpIcon as TrendingUpDown,
  Building2,
  LogIn,
  MessageSquare,
  Edit,
  PlusCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import type { Contact } from "@/contact";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Chargement paresseux des composants
const TabsDevis = lazy(() => import("./TabsDevis"));
const TabsFacture = lazy(() => import("./TabsFacture"));
const NotesApp = lazy(() => import("./notes-app"));
const TaskManager = lazy(() => import("./task-manager"));

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

  const handlePostActivity = () => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: activityType,
      user: "Vous", // Normalement, vous utiliseriez l'utilisateur connecté
      timestamp: new Date(),
    };

    if (activityType === "comment" && comment.trim()) {
      newActivity.text = comment;
    } else if (activityType === "update") {
      const oldValues: Record<string, string> = {};
      const newValues: Record<string, string> = {};

      updateFields.forEach((field) => {
        if (field.fieldName && (field.oldValue || field.newValue)) {
          oldValues[field.fieldName] = field.oldValue;
          newValues[field.fieldName] = field.newValue;
        }
      });

      if (Object.keys(oldValues).length === 0) return;

      newActivity.oldValues = oldValues;
      newActivity.newValues = newValues;
    } else if (activityType === "creation") {
      const createdFields: Record<string, string> = {};

      creationFields.forEach((field) => {
        if (field.fieldName && field.value) {
          createdFields[field.fieldName] = field.value;
        }
      });

      if (Object.keys(createdFields).length === 0) return;

      newActivity.createdFields = createdFields;
    }

    // Vérifier si l'activité a du contenu avant de l'ajouter
    if (
      (newActivity.text && newActivity.text.trim()) ||
      (newActivity.oldValues &&
        Object.keys(newActivity.oldValues).length > 0) ||
      (newActivity.createdFields &&
        Object.keys(newActivity.createdFields).length > 0)
    ) {
      setActivities([newActivity, ...activities]);

      // Réinitialiser les champs
      setComment("");
      setUpdateFields([{ oldValue: "", newValue: "", fieldName: "" }]);
      setCreationFields([{ fieldName: "", value: "" }]);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const addUpdateField = () => {
    setUpdateFields([
      ...updateFields,
      { oldValue: "", newValue: "", fieldName: "" },
    ]);
  };

  const removeUpdateField = (index: number) => {
    if (updateFields.length > 1) {
      const newFields = [...updateFields];
      newFields.splice(index, 1);
      setUpdateFields(newFields);
    }
  };

  const updateUpdateField = (index: number, field: string, value: string) => {
    const newFields = [...updateFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setUpdateFields(newFields);
  };

  const addCreationField = () => {
    setCreationFields([...creationFields, { fieldName: "", value: "" }]);
  };

  const removeCreationField = (index: number) => {
    if (creationFields.length > 1) {
      const newFields = [...creationFields];
      newFields.splice(index, 1);
      setCreationFields(newFields);
    }
  };

  const updateCreationField = (index: number, field: string, value: string) => {
    const newFields = [...creationFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setCreationFields(newFields);
  };

  const renderActivityForm = () => {
    switch (activityType) {
      case "comment":
        return (
          <div className="relative w-full">
            <Textarea
              placeholder="Laissez un commentaire..."
              className="min-h-[80px] text-sm pt-3 pb-10 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <button
                className="text-gray-400 hover:text-gray-600"
                aria-label="Ajouter un emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={18} />
              </button>
              {showEmojiPicker && (
                <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-4 border z-10">
                  <div className="grid grid-cols-8 gap-2 text-xl">
                    {[
                      "😀",
                      "😂",
                      "😊",
                      "😍",
                      "🤔",
                      "👍",
                      "👎",
                      "❤️",
                      "🎉",
                      "🔥",
                      "💯",
                      "🙏",
                      "👏",
                      "🤝",
                      "💪",
                      "⭐",
                      "🌟",
                      "💰",
                      "📈",
                      "📉",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        className="hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "update":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Enregistrer les modifications effectuées
            </p>
            {updateFields.map((field, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="Nom du champ"
                    value={field.fieldName}
                    onChange={(e) =>
                      updateUpdateField(index, "fieldName", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Ancienne valeur"
                    value={field.oldValue}
                    onChange={(e) =>
                      updateUpdateField(index, "oldValue", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle valeur"
                    value={field.newValue}
                    onChange={(e) =>
                      updateUpdateField(index, "newValue", e.target.value)
                    }
                    className="text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUpdateField(index)}
                    disabled={updateFields.length <= 1}
                    className="h-9 w-9"
                  >
                    <span className="sr-only">Supprimer</span>✕
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addUpdateField}
              className="mt-2"
            >
              Ajouter un champ
            </Button>
          </div>
        );

      case "creation":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Enregistrer une nouvelle création
            </p>
            {creationFields.map((field, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="Nom du champ"
                    value={field.fieldName}
                    onChange={(e) =>
                      updateCreationField(index, "fieldName", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Valeur"
                    value={field.value}
                    onChange={(e) =>
                      updateCreationField(index, "value", e.target.value)
                    }
                    className="text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCreationField(index)}
                    disabled={creationFields.length <= 1}
                    className="h-9 w-9"
                  >
                    <span className="sr-only">Supprimer</span>✕
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addCreationField}
              className="mt-2"
            >
              Ajouter un champ
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderActivityItem = (activity: ActivityItem) => {
    switch (activity.type) {
      case "comment":
        return (
          <div className="p-3 border rounded-md mb-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-blue-500" />
              <span className="font-medium">{activity.user}</span>
              <span className="text-xs text-gray-500">
                {activity.timestamp.toLocaleString()}
              </span>
            </div>
            <p className="text-sm">{activity.text}</p>
          </div>
        );

      case "update":
        return (
          <div className="p-3 border rounded-md mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Edit size={16} className="text-amber-500" />
              <span className="font-medium">{activity.user}</span>
              <span className="text-xs text-gray-500">
                {activity.timestamp.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-2">Modifications effectuées:</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-1 border text-xs">Champ</th>
                    <th className="text-left p-1 border text-xs">
                      Ancienne valeur
                    </th>
                    <th className="text-left p-1 border text-xs">
                      Nouvelle valeur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activity.oldValues &&
                    activity.newValues &&
                    Object.keys(activity.oldValues).map((key) => (
                      <tr key={key}>
                        <td className="p-1 border text-xs">{key}</td>
                        <td className="p-1 border text-xs">
                          {activity.oldValues?.[key] || "-"}
                        </td>
                        <td className="p-1 border text-xs">
                          {activity.newValues?.[key] || "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "creation":
        return (
          <div className="p-3 border rounded-md mb-3">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle size={16} className="text-green-500" />
              <span className="font-medium">{activity.user}</span>
              <span className="text-xs text-gray-500">
                {activity.timestamp.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-2">Nouvelle création:</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-1 border text-xs">Champ</th>
                    <th className="text-left p-1 border text-xs">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.createdFields &&
                    Object.keys(activity.createdFields).map((key) => (
                      <tr key={key}>
                        <td className="p-1 border text-xs">{key}</td>
                        <td className="p-1 border text-xs">
                          {activity.createdFields?.[key] || "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activity":
        return (
          <TabsContent value="activity" className="p-4 mt-0 max-w-3xl">
            <div className="mb-4">
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
                      className="bg-black hover:bg-gray-800"
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
            </div>
          </TabsContent>
        );

      case "devis":
        return (
          <TabsContent value="devis" className="p-4">
            <Suspense fallback={<div>Chargement des devis...</div>}>
              <TabsDevis />
            </Suspense>
          </TabsContent>
        );

      case "facture":
        return (
          <TabsContent value="facture" className="p-4">
            <Suspense fallback={<div>Chargement des factures...</div>}>
              <TabsFacture />
            </Suspense>
          </TabsContent>
        );

      case "notes":
        return (
          <TabsContent value="notes" className="p-4">
            <Suspense fallback={<div>Chargement des notes...</div>}>
              <NotesApp />
            </Suspense>
          </TabsContent>
        );

      case "tasks":
        return (
          <TabsContent value="tasks" className="p-4">
            <Suspense fallback={<div>Chargement des tâches...</div>}>
              <TaskManager />
            </Suspense>
          </TabsContent>
        );

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
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${
              activeTab === "activity" ? "bg-gray-100" : ""
            }`}
          >
            <Activity size={16} className="mr-2" />
            Activité
          </TabsTrigger>
          <TabsTrigger
            value="devis"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${
              activeTab === "devis" ? "bg-gray-100" : ""
            }`}
          >
            <TrendingUpDown size={16} className="mr-2" />
            Devis
          </TabsTrigger>
          <TabsTrigger
            value="facture"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${
              activeTab === "facture" ? "bg-gray-100" : ""
            }`}
          >
            <Building2 size={16} className="mr-2" />
            Facture
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${
              activeTab === "notes" ? "bg-gray-100" : ""
            }`}
          >
            <FileText size={16} className="mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className={`data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none ${
              activeTab === "tasks" ? "bg-gray-100" : ""
            }`}
          >
            <CheckSquare size={16} className="mr-2" />
            Tâches
          </TabsTrigger>
        </TabsList>

        <Separator />

        {renderTabContent()}
      </Tabs>
    </div>
  );
}