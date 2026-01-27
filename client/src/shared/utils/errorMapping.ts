/**
 * Maps server error messages to translation keys for proper error display
 */
export const getErrorTranslationKey = (error: string | undefined): string => {
  if (!error) return '';

  // Map server error messages to translation keys
  const errorMappings: Record<string, string> = {
    // Registration errors
    'User already exists': 'userExists',
    'User with this email already exists': 'userExists',
    'Email already in use': 'userExists',
    'Username already taken': 'userExists',
    'Invalid email format': 'emailInvalid',
    'Password too weak': 'passwordWeak',

    // Login errors
    'Invalid credentials': 'invalidData',
    'Invalid username or password': 'invalidData',
    'User not found': 'invalidData',
    'Wrong password': 'invalidData',
    'Account not activated': 'accountNotActivated',
    'Too many attempts': 'tooManyAttempts',

    // General errors
    'Network Error': 'networkError',
  };

  return errorMappings[error] || 'serverError';
};