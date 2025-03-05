import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";


export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <ProductHeader />
      <div className="mt-6">
        <ProductsTable />
      </div>
    </div>
  )
}