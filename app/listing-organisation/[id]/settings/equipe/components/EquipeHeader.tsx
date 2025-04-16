import { PageHeader } from "@/components/PageHeader";

interface EquipeHeaderProps {
  activeTab: "employes" | "profil" | "permission";
}

export function EquipeHeader({ activeTab }: EquipeHeaderProps) {
  
  // Déterminer les textes en fonction de l'onglet actif
  const getTexts = () => {
    switch (activeTab) {
      case "employes":
        return {
          searchPlaceholder: "Rechercher un employé",
          buttonText: "Ajouter un employé",
          buttonLabel: "employé",
          showButton: true
        };
      case "profil":
        return {
          searchPlaceholder: "Rechercher un profil",
          buttonText: "Ajouter un profil",
          buttonLabel: "profil",
          showButton: true
        };
      case "permission":
        return {
          searchPlaceholder: "Rechercher une permission",
          buttonText: "", // Texte vide car le bouton ne sera pas affiché
          buttonLabel: "permission",
          showButton: false // Indicateur pour ne pas afficher le bouton
        };
      default:
        return {
          searchPlaceholder: "Rechercher",
          buttonText: "Ajouter",
          buttonLabel: "élément",
          showButton: true
        };
    }
  };

  const { searchPlaceholder, buttonText, buttonLabel, showButton } = getTexts();

  return (
    <div className="">
      <PageHeader
        title="Equipe"
        searchPlaceholder={searchPlaceholder}
        showAddButton={showButton} // On passe showButton pour contrôler l'affichage
        addButtonText={buttonText}
      />
    </div>
  );
}