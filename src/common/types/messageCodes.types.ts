export enum EMessageCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  DB_ERROR = 'DB_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',
  EMPTY_BODY = 'EMPTY_BODY',
  EXTERNAL = 'EXTERNAL',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NOT_FOUND = 'NOT_FOUND',
  OK = 'OK',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_VERIFY = 'REFRESH_TOKEN_VERIFY',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_MALFORMED = 'TOKEN_MALFORMED',
  TOKEN_NOT_PROVIDED = 'TOKEN_NOT_PROVIDED',
  TOKEN_VERIFY = 'TOKEN_VERIFY',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
}
