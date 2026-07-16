function mapFieldName(field) {
  const fieldMap = {
    fullName: 'name',
    firstName: 'name',
    phoneNumber: 'phone',
    phone: 'phone',
    email: 'email',
    password: 'password',
    confirmPassword: 'confirmPassword',
  };

  return fieldMap[field] ?? field;
}

export function getBackendErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response || error?.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server.\n\nPlease check your internet connection and try again.';
  }

  const payload = error.response.data ?? {};

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  if (payload.errors && typeof payload.errors === 'object') {
    const firstFieldMessage = Object.values(payload.errors).find(
      (message) => typeof message === 'string' && message.trim()
    );

    if (firstFieldMessage) {
      return firstFieldMessage.trim();
    }
  }

  if (error.response.status >= 500) {
    return 'Something went wrong.\n\nPlease try again in a few minutes.';
  }

  return fallback;
}

export function getFriendlyGeneralError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response || error?.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server.\n\nPlease check your internet connection and try again.';
  }

  const status = error.response.status;
  const payload = error.response.data ?? {};

  if (status >= 500) {
    return 'Something went wrong.\n\nPlease try again in a few minutes.';
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

export function normalizeRegisterError(error) {
  const empty = { fieldErrors: {}, generalError: '' };

  if (!error?.response || error?.code === 'ERR_NETWORK') {
    return {
      ...empty,
      generalError: 'Unable to connect to the server.\n\nPlease check your internet connection and try again.',
    };
  }

  const { status, data = {} } = error.response;

  if (status === 409 && data.field) {
    return {
      ...empty,
      fieldErrors: {
        [mapFieldName(data.field)]: data.message || 'This value is already in use.',
      },
    };
  }

  if (status === 422 && data.errors && typeof data.errors === 'object') {
    const mappedErrors = Object.entries(data.errors).reduce((acc, [field, message]) => {
      acc[mapFieldName(field)] = message;
      return acc;
    }, {});

    return {
      ...empty,
      fieldErrors: mappedErrors,
    };
  }

  if (status >= 500) {
    return {
      ...empty,
      generalError: 'Something went wrong.\n\nPlease try again in a few minutes.',
    };
  }

  return {
    ...empty,
    generalError: typeof data.message === 'string' && data.message.trim()
      ? data.message
      : 'Registration failed. Please try again.',
  };
}
