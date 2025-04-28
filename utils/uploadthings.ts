import axios from "axios";

// Exemple de fonction pour télécharger une image vers Uploadthing
export async function uploadImageToUploadthing(imagePath: string) {
  try {
    const formData = new FormData();
    formData.append("file", imagePath); // Remplacez `imagePath` par le fichier ou l'URL de l'image

    // Remplacez l'URL ci-dessous par l'URL de l'API d'Uploadthing
    const response = await axios.post("https://uploadthing.com/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Vous pouvez retourner l'URL de l'image, ou les informations retournées par Uploadthing
    return response.data;  // Exemple de données retournées par Uploadthing
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    throw new Error("Erreur de téléchargement de l'image");
  }
}
