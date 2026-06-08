function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="mb-2 text-3xl font-bold text-red-600">
          Something went wrong
        </h1>
        <p className="mb-6 text-gray-600">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;