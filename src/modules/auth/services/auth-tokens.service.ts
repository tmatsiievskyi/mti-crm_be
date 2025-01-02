import { ETokenTypes } from '@common/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Crypting } from 'src/utils';
import { RefreshTokenDao } from '../dao/refresh-token.dao';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenDao: RefreshTokenDao,
  ) {}

  async generateAuthTokens(userId: number) {
    const accessTokenData = this.getAccessToken(userId);
    const refreshTokenData = await this.getRefreshToken(userId);

    const tokens = {
      access_token: {
        token: accessTokenData.token,
        expiresIn: accessTokenData.expiresIn,
      },
      refresh_token: {
        token: refreshTokenData.token,
        expiresIn: refreshTokenData.expiresIn,
      },
    };

    return tokens;
  }

  getAccessToken(userId: number) {
    const accessTokenExpiresIn = Number(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );

    const token = this.jwtService.sign(
      {
        sub: userId,
        type: ETokenTypes.BEARER,
      },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: accessTokenExpiresIn,
      },
    );

    return { token, expiresIn: accessTokenExpiresIn };
  }

  async getRefreshToken(userId: number) {
    const refreshTokenExpiresIn = Number(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );

    const token = this.jwtService.sign(
      {
        sub: userId,
        type: ETokenTypes.BEARER,
      },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return { token, expiresIn: refreshTokenExpiresIn };
  }

  async saveRefreshTokenInDB(
    refreshToken: string,
    userId: number,
    expiresAt: number,
  ) {
    const hashedRefreshToken = await Crypting.hashString(refreshToken);

    await this.refreshTokenDao.create({
      data: {
        token: hashedRefreshToken,
        userId,
        expiresAt: new Date(new Date().getTime() + expiresAt * 1000),
      },
    });
  }

  async updateRefreshTokenInDB(
    oldRefreshToken: string,
    newRefreshToken: string,
    userId: number,
    expiresIn: number,
  ) {
    await this.refreshTokenDao.update({
      where: {
        userId,
        token: oldRefreshToken,
      },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(new Date().getTime() + expiresIn * 1000),
      },
    });
  }

  async removeRefreshTokens(userId: number) {
    return await this.refreshTokenDao.deleteMany({ where: { userId } });
  }

  getAccessTokenCookie(token: string, expiresIn: number) {
    return `access_token=${token}; HttpOnly; Path=/; SameSite=Strict; ${this.configService.getOrThrow('NODE_ENV') === 'production' ? 'Secure;' : ''} Max-Age=${expiresIn}`;
  }

  getRefreshTokenCookie(token: string, expiresIn: number) {
    return `refresh_token=${token}; HttpOnly; Path=/; SameSite=Strict; ${this.configService.getOrThrow('NODE_ENV') === 'production' ? 'Secure;' : ''} Max-Age=${expiresIn}`;
  }

  public getCookiesForLogOut() {
    return [
      'access_token=; HttpOnly; Path=/; Max-Age=0',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
