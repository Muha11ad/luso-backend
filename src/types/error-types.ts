export const ExceptionErrorTypes = {
  INVALID_CODE: 'Invalid code',
  EMAIL_EXISTS: 'Email already exists',
  EMAIL_NOT_SENT: 'Failed to send email',
  FILE_REQUIRED: 'File is required',
  NOT_FOUND: 'Requested resource not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ERROR_SAVING_FILE: 'Unexpected error while saving file',
  ERROR_DELETING_FILE: 'Unexpected error while deleting file',
  ERROR_UPDATING_FILE: 'Unexpected error while updating file',
  MAX_FILE_SIZE: 'File size exceeds the maximum limit of 10 MB.',
  ERROR_CONVERTING_FILE: 'Unexpected error while converting file',
  ALREADY_EXISTS: 'Resource already exists, please use a different information',
  UNSUPPORTED_FILE_FORMAT: 'Unsupported file format. Only JPEG and PNGare allowed.',
};
export const DtoErrorTypes = {
  MUST_BE_STRING: 'This field must be a string',
  REQUIRED_INFO: 'This field is required',
  INVALID_EMAIL: 'Use your actual email address',
  INVALID_PASSWORD: 'Password must be between 4 and 20 characters ',
};
