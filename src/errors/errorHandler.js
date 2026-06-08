import { getErrorMessage } from "@/errors/errorMessages";

export const handleApiError = (error) => {
  const message = getErrorMessage(error);
  console.error("[API Error]", message, error);
  return message;
};