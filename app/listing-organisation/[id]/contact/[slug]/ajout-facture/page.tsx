import DashboardSidebar from "@/components/DashboardSidebar";
import InvoiceForm from "./components/invoice-form";

export default function Home() {
  return (
    <main className="flex w-full items-center justify-center bg-gray-100">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <InvoiceForm />
      </div>
    </main>
  );
}
