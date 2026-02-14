import PropertyForm from "@/components/admin/PropertyForm"

export default function AddPropertyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new property listing</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <PropertyForm mode="create" />
      </div>
    </div>
  )
}
