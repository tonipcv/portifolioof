export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-700 rounded w-48"></div>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
        </div>
        <div className="grid gap-4">
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
} 