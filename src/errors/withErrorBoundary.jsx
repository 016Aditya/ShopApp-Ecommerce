import ErrorBoundary from "@/errors/ErrorBoundary";

function withErrorBoundary(WrappedComponent) {
  return function WithErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default withErrorBoundary;