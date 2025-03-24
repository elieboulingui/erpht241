"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Image,
  MoreVertical,
  Pin,
  Plus,
  Redo,
  Smile,
  Undo,
  Users,
} from "lucide-react";
import { IconButton } from "./icon-button";
import { CreateNote } from "@/app/listing-organisation/[id]/contact/[slug]/actions/createNote";
import { ColorPickerButton } from "./color-picker-button";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (title: string, content: string, contactId: string) => void;
}

export function CreateNoteDialog({
  isOpen,
  onOpenChange,
  onCreateNote,
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [contactId, setContactId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fonction pour extraire l'ID du contact depuis l'URL
  function extractContactId(url: string): string | null {
    const regex = /contact\/([a-z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null; // Retourne l'ID ou null si aucun match
  }

  // Utilisation de useEffect pour récupérer l'ID du contact au moment du montage du composant
  useEffect(() => {
    const currentUrl = window.location.href;
    const extractedContactId = extractContactId(currentUrl);
    setContactId(extractedContactId);
  }, []);

  const handleCreateNote = async () => {
    if (!contactId || !title.trim()) return;

    setIsCreating(true);

    try {
      // Appel à la fonction CreateNote avec les paramètres nécessaires
      const response = await CreateNote({
        contactId,
        title,
        content,
        color,
        LastModified: new Date(),
      });

      if (response.success) {
        console.log("Note créée avec succès !");

        // Appeler la fonction du parent pour mettre à jour l'état des notes
        onCreateNote(title, content, contactId);

        // Réinitialiser les champs après la création
        setTitle("");
        setContent("");
        setColor(undefined);

        // Fermer le dialogue
        onOpenChange(false);
      } else {
        console.error("Erreur lors de la création de la note", response.error);
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la création de la note",
        error
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleColorSelect = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Titre"
            className="border-none text-lg font-medium focus-visible:ring-0 px-0 h-auto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pin className="h-5 w-5" />
          </Button>
        </div>

        <Textarea
          placeholder="Créer une note..."
          className="min-h-[100px] border-none resize-none focus-visible:ring-0 px-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <IconButton
              className=""
              icon={Smile}
              name="Emoji"
              disabled={isSaving}
            />
            <IconButton icon={Bell} name="Rappel" disabled={isSaving} />
            <IconButton
              icon={Users}
              name="Collaborateurs"
              disabled={isSaving}
            />
            <IconButton
              icon={Image}
              name="Ajouter une image"
              disabled={isSaving}
            />
            {/* Utilisation du ColorPickerButton avec les props nécessaires */}
            <ColorPickerButton
              onSelectColor={handleColorSelect}
              currentColor={color}
              disabled={isSaving}
            />
            {/* <IconButton icon={Plus} name="Ajouter" /> */}
            <IconButton icon={MoreVertical} name="Plus d'options" />
            {/* <IconButton icon={Undo} name="Annuler" />
            <IconButton icon={Redo} name="Rétablir" /> */}
          </div>

          <Button
            variant="ghost"
            onClick={handleCreateNote}
            disabled={isCreating}
          >
            {isCreating ? "Création en cours..." : "Fermer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
