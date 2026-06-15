import toast from "react-hot-toast";

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  custom: (message, options = {}) => {
    toast(message, {
      duration: 3000,
      ...options,
    });
  },

  dismiss: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || "Loading...",
        success: messages.success || "Success!",
        error: messages.error || "Error!",
        ...options,
      },
      options
    );
  },
};

export default showToast;
