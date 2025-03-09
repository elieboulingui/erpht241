"use client";

import { useState } from "react";
import {
  Activity,
  FileText,
  CheckSquare,
  Smile,
  TrendingUpIcon as TrendingUpDown,
  Building2,
  LogIn,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Contact } from "@/contact";
import { ActivityFeed } from "./ActivityFeedProps";
import TabsDevis from "./TabsDevis";
import TabsFacture from "./TabsFacture";
import NotesApp from "./notes-app";

interface ContactTabsProps {
  contact: Contact;
}

export function ContactTabs({ contact }: ContactTabsProps) {
  const [activeTab, setActiveTab] = useState("activity");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    Array<{ id: string; text: string; user: string; timestamp: Date }>
  >([]);
  const [showComments, setShowComments] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handlePostComment = () => {
    if (comment.trim()) {
      // Créer un nouveau commentaire
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        user: "Vous", // Normalement, vous utiliseriez l'utilisateur connecté
        timestamp: new Date(),
      };

      // Ajouter le commentaire à la liste
      setComments([newComment, ...comments]);

      // Réinitialiser le champ de commentaire
      setComment("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex-1">
      <Tabs
        defaultValue="activity"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
          <TabsTrigger
            value="activity"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <Activity size={16} className="mr-2" />
            Activité
          </TabsTrigger>
          <TabsTrigger
            value="devis"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <TrendingUpDown size={16} className="mr-2" />
            Devis
          </TabsTrigger>
          <TabsTrigger
            value="facture"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <Building2 size={16} className="mr-2" />
            Facture
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <FileText size={16} className="mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <CheckSquare size={16} className="mr-2" />
            Tâches
          </TabsTrigger>
          <TabsTrigger
            value="log"
            className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
          >
            <LogIn size={16} className="mr-2" />
            Log
          </TabsTrigger>
        </TabsList>

        <Separator />

        {/* Contenu de l'onglet Activité */}
        <TabsContent value="activity" className="p-4 mt-0 max-w-3xl">
          <div className="mb-4">
            <div className="flex mt-3">
              <Avatar className="h-10 w-10 bg-gray-200 p-2.5 mr-2">
                {contact.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div className="relative w-full">
                <Input
                  placeholder="Laissez un commentaire..."
                  className="min-h-[80px] text-sm pt-3 pb-10"
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
                    <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-10 border z-10">
                      <div className="grid grid-cols-8 gap-10 text-2xl">
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
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-black hover:bg-gray-800"
                    onClick={handlePostComment}
                    disabled={!comment.trim()}
                  >
                    Publier
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-comments"
                  checked={showComments}
                  onCheckedChange={(checked) => setShowComments(!!checked)}
                />
                <label
                  htmlFor="show-comments"
                  className="text-sm cursor-pointer"
                >
                  Afficher les commentaires
                </label>
              </div>
            </div>
          </div>

          {showComments && contact && (
            <ActivityFeed contact={contact} comments={comments} />
          )}
        </TabsContent>

        {/* Contenu des autres onglets */}
        <TabsContent value="devis" className="p-4">
          <TabsDevis />
        </TabsContent>

        <TabsContent value="facture" className="p-4">
          <TabsFacture />
        </TabsContent>

        <TabsContent value="notes" className="p-4">
          <NotesApp />          
        </TabsContent>

        <TabsContent value="tasks" className="p-4">
          <div className="text-center text-gray-500 py-8">
            Aucune tâche pour l'instant
          </div>
        </TabsContent>

        <TabsContent value="log" className="p-4">
          <div className="text-center text-gray-500 py-8">
            Aucun log pour l'instant
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
