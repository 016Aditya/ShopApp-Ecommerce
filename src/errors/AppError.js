export class AppError extends Error {
  constructor(message, statusCode = null, data = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.data = data;
  }
}