import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignUpDto } from './dto';
import { JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import { TReqWithUser, TReqWithUserRefresh } from '@common/types';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() req: TReqWithUser) {
    const { user } = req;

    const { cookies, user: resultUser } = await this.authService.signIn(
      user.id,
    );

    req.res?.setHeader('Set-Cookie', Object.values(cookies));

    return resultUser;
  }

  @Post('sign-out')
  async signOut(@Req() req: TReqWithUser) {
    const { cookies } = await this.authService.signOut(1);

    req.res?.setHeader('Set-Cookie', cookies);

    return 'ok';
  }

  @Get('me')
  getMe(@Req() req: TReqWithUser) {
    const { user } = req;

    return this.authService.handleGetMe(user.id);
  }

  @Public()
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  async refreshTokens(@Req() req: TReqWithUserRefresh) {
    if (!req.user.attributes) throw new InternalServerErrorException();

    const data = await this.authService.handleRefresh(
      req.user.attributes.id,
      req.cookies.refresh_token,
      req.user.refreshTokenExpires,
    );

    req.res?.setHeader('Set-Cookie', Object.values(data!.cookies));

    return 'ok';
  }
}
