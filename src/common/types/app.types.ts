import { Request } from 'express';
import { TUser } from './entities.types';

export type TRequest = Request;

export class TResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type TReqWithUser = {
  user: TUser;
} & TRequest;

export type TReqWithUserRefresh = {
  user: {
    attributes: TUser;
    refreshTokenExpires: Date;
  };
} & TRequest;

export enum ETokenTypes {
  BEARER = 'Bearer',
}

export type TCookieParam = {
  domain: string;
  expiresIn: string;
  maxAge?: number;
  rememberMe: boolean;
};
