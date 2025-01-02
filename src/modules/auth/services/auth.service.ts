import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../dto';
import { UsersService } from 'src/modules/users/users.service';
import { ServiceCore } from '@common/core';
import { Crypting, removeFromObj } from 'src/utils';
import { EAuthMethod } from '@prisma/client';
import { TUserIncludes } from 'src/modules/users/users.dao';
import { AuthTokensService } from './auth-tokens.service';
import { TRefreshToken } from '@common/types';

@Injectable()
export class AuthService extends ServiceCore {
  constructor(
    private readonly usersService: UsersService,
    private readonly authTokensService: AuthTokensService,
  ) {
    super();
  }

  async signIn(id: number) {
    const user = await this.usersService.findById(id, {
      organization: true,
      units: true,
      roles: true,
      permissions: true,
      accounts: true,
    });

    if (!user) throw new UnauthorizedException('User is not found');

    const tokens = await this.authTokensService.generateAuthTokens(id);

    await this.authTokensService.saveRefreshTokenInDB(
      tokens.refresh_token.token,
      user.id,
      tokens.refresh_token.expiresIn,
    );

    const cookies = {
      access_token: this.authTokensService.getAccessTokenCookie(
        tokens.access_token.token,
        tokens.access_token.expiresIn,
      ),
      refresh_token: this.authTokensService.getRefreshTokenCookie(
        tokens.refresh_token.token,
        tokens.refresh_token.expiresIn,
      ),
    };

    return { tokens, cookies, user: removeFromObj(user, ['password']) };
  }

  async signUp(dto: SignUpDto) {
    try {
      const isUserExists = await this.usersService.findByEmail(dto.email);
      if (isUserExists) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await Crypting.hashString(dto.password);

      await this.usersService.createUser({
        ...dto,
        password: hashedPassword,
        method: EAuthMethod.CREDENTIALS,
      });

      // email service

      return { message: 'User has been created' };
    } catch (error) {
      this.handleError(error);
    }
  }

  async signOut(userId: number) {
    await this.authTokensService.removeRefreshTokens(userId);
    const logoutCookies = this.authTokensService.getCookiesForLogOut();
    return { cookies: logoutCookies };
  }

  async validateUser(
    email: string,
    password: string,
    includes?: TUserIncludes,
  ) {
    try {
      const user = await this.usersService.findByEmail(email, includes);

      // if (!user?.isVerified) {
      //   throw new UnauthorizedException('User Email is not verified'); //TODO: add verifi
      // }

      // if (!user?.isActive) {
      //   throw new UnauthorizedException('User account is not active');
      // }

      if (user) {
        const pwMatch = await Crypting.compareStrings(user.password, password);
        return pwMatch ? user : null;
      }

      return null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async handleGetMe(userId: number) {
    try {
      const user = await this.usersService.findById(userId, {
        organization: true,
        units: true,
        roles: true,
        profile: true,
        accounts: true,
        permissions: true,
      });

      if (!user) throw new UnauthorizedException();

      return removeFromObj(user, ['password']);
    } catch (error) {
      this.handleError(error);
    }
  }

  async handleRefresh(userId: number, refreshToken: string, expiresAt: Date) {
    try {
      const user = await this.usersService.findById(userId, {
        refreshToken: true,
      });

      if (!user) throw new UnauthorizedException(`Invalid user id:${userId}`);

      if (!user.refreshToken || !(user.refreshToken.length > 0))
        throw new UnauthorizedException(
          `Refresh tokens do not exists for user id:${userId}`,
        );

      const { refreshToken: refreshTokensInDB } = user;

      const tokenMatch = await this.isTokenInDBMatch(
        refreshTokensInDB,
        refreshToken,
      );

      if (
        !tokenMatch ||
        !tokenMatch.isMatch ||
        new Date(expiresAt) < new Date()
      )
        throw new UnauthorizedException('Invalid refresh_token');

      const tokens = await this.authTokensService.generateAuthTokens(userId);

      const hashedRefToken = await Crypting.hashString(
        tokens.refresh_token.token,
      );

      await this.authTokensService.updateRefreshTokenInDB(
        tokenMatch.refreshToken.token,
        hashedRefToken,
        userId,
        tokens.refresh_token.expiresIn,
      );

      const cookies = {
        access_token: this.authTokensService.getAccessTokenCookie(
          tokens.access_token.token,
          tokens.access_token.expiresIn,
        ),
        refresh_token: this.authTokensService.getRefreshTokenCookie(
          tokens.refresh_token.token,
          tokens.refresh_token.expiresIn,
        ),
      };

      return { tokens, cookies };
    } catch (error) {
      this.handleError(error);
    }
  }

  async isTokenInDBMatch(
    tokensInDB: TRefreshToken[],
    currentRefreshToken: string,
  ) {
    const comparePromises = tokensInDB.map(async (refreshToken) => {
      const isMatch = await Crypting.compareStrings(
        refreshToken.token,
        currentRefreshToken,
      );
      return { isMatch, refreshToken };
    });

    const result = await Promise.all(comparePromises);

    return result.find((res) => res.isMatch);
  }
}
