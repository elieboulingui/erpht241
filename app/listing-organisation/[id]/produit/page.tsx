import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";


export default function ProductsPage() {
  return (
    <div className="px-5 py-4">
      <ProductHeader />
      <div className="mt-6">
        <ProductsTable />
      </div>
    </div>
  )
}