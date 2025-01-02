import { DaoCore } from '@common/core';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TUserDelegate = Prisma.UserDelegate;
export type TUserIncludes = Prisma.UserInclude;

@Injectable()
export class UsersDao extends DaoCore<
  TUserDelegate,
  TDelegateArgs<TUserDelegate>,
  TDelegateReturnTypes<TUserDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }
}
