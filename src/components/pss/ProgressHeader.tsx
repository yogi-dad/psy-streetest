export function ProgressHeader() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Perceived Stress Scale
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Rate how often you have experienced each situation over the past month
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Questions Remaining:</span>
            <span className="ml-2 text-primary-600">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
