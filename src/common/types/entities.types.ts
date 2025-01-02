import {
  User,
  Account,
  Organization,
  Permission,
  Profile,
  RefreshToken,
  Role,
  Unit,
} from '@prisma/client';

export type TUser = User & { roles?: TRole[] } & {
  organization?: TOrganization;
} & { policies?: TPersmission[] } & { units?: TUnit[] } & {
  refreshToken?: TRefreshToken[];
} & { profile?: TProfile[] };

export type TAccount = Account;

export type TOrganization = Organization;

export type TPersmission = Permission;

export type TProfile = Profile;

export type TRefreshToken = RefreshToken;

export type TRole = Role;

export type TUnit = Unit;
