import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        },
        success: {
          style: {
            background: "#10b981",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
          },
        },
        error: {
          style: {
            background: "#ef4444",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },
        loading: {
          style: {
            background: "#3b82f6",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
