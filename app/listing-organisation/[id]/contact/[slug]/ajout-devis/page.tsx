import DashboardSidebar from "@/components/DashboardSidebar";
import InvoiceForm from "./components/invoice-form";

export default function Home() {
  return (
    <main className="flex w-full items-center justify-between">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <InvoiceForm />
      </div>
    </main>
  );
}
