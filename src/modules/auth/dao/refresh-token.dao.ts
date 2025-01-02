import { DaoCore } from '@common/core';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TRefreshTokenDelegate = Prisma.RefreshTokenDelegate;
export type TRefreshTokenIncludes = Prisma.RefreshTokenInclude;

@Injectable()
export class RefreshTokenDao extends DaoCore<
  TRefreshTokenDelegate,
  TDelegateArgs<TRefreshTokenDelegate>,
  TDelegateReturnTypes<TRefreshTokenDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.refreshToken);
  }
}
