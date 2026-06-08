export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You are not authorized. Please log in.",
  FORBIDDEN: "You do not have permission to access this.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check the form fields and try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  if (error.statusCode === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (error.statusCode === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (error.statusCode === 404) return ERROR_MESSAGES.NOT_FOUND;
  if (error.statusCode >= 500) return ERROR_MESSAGES.SERVER_ERROR;

  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
};