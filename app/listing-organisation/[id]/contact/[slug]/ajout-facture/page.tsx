import DashboardSidebar from "@/components/DashboardSidebar";
import AjoutFactureManuel from "./components/form-facture";

export default function Home() {
  return (
    <main className="flex w-full items-center justify-between">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <AjoutFactureManuel
        />
      </div>
    </main>
  );
}
