import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy, LocalStrategy } from './strategies';
import { AuthTokensService } from './services/auth-tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenDao } from './dao/refresh-token.dao';
import { PrismaModule } from '@libs/prisma';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [UsersModule, PassportModule, PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokensService,
    RefreshTokenDao,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
