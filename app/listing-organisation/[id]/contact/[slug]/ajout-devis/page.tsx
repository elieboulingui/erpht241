import DashboardSidebar from "@/components/DashboardSidebar";
import AjoutDevisManuel from "./components/form-devis";

export default function Home() {
  return (
    <main className="flex w-full items-center justify-between">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <AjoutDevisManuel
        />
      </div>
    </main>
  );
}
